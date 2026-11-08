"""Local synchronization: plan and apply folders and files from a manifest through the filesystem service.

Two manifest kinds feed one planner: the root seed manifest (seed/manifest.yaml, classified by folder descriptors and the lock) and
a generic sync manifest (kind: filesystem-sync, validated against source/schema/filesystem/sync-manifest.schema.json) that selects
local trees by explicit include/exclude rules and states its classification. Identity is the registry code, never the local path, so
a renamed local file keeps its logical file. A file that disappears locally is reported by nothing and deleted nowhere.
"""
from __future__ import annotations

import fnmatch
import json
import re
from dataclasses import dataclass, field
from pathlib import Path, PurePosixPath

import psycopg
import yaml
from jsonschema import Draft202012Validator

from mzizi_manifest import seed_registry as seeds
from mzizi_manifest.paths import SCHEMA_ROOT, SEED_ROOT

from .authz import Authorizer, OperatorAuthorizer
from .repository import Conflict, PermissionDenied, Repository
from .codes import child_code, is_code
from .service import FilesystemService, Registration

SENSITIVE_NAMES = ("*.env", ".env", ".env.*", "*.key", "id_rsa*", "id_ed25519*", "private.pem", "*.p12", "*.pfx", "credentials*", "*secret*")
PRIVATE_KEY = re.compile(rb"-----BEGIN (?:[A-Z]+ )?PRIVATE KEY-----")


class ManifestError(ValueError):
    pass


@dataclass
class FolderSpec:
    path: str
    code: str | None = None
    fields: dict = field(default_factory=dict)


@dataclass
class FileSpec:
    local: Path
    folder_path: str
    name: str
    code: str | None
    retention: str = "preserve_history"
    pin_reason: str | None = None
    provenance_extra: dict = field(default_factory=dict)
    declared_type: str | None = None


@dataclass
class Plan:
    name: str
    folders: list[FolderSpec] = field(default_factory=list)
    files: list[FileSpec] = field(default_factory=list)
    blocked: list[tuple[str, str]] = field(default_factory=list)


@dataclass
class SyncItem:
    kind: str  # folder | file
    path: str
    outcome: str
    detail: str = ""
    action: str | None = None
    key: str | None = None
    reused_storage: bool = False
    recovered: bool = False
    verified: bool = False
    revision: int | None = None


@dataclass
class SyncReport:
    name: str
    dry_run: bool
    items: list[SyncItem] = field(default_factory=list)

    def summary(self, kind: str | None = None) -> dict[str, int]:
        out: dict[str, int] = {}
        for item in self.items:
            if kind is None or item.kind == kind:
                out[item.outcome] = out.get(item.outcome, 0) + 1
        return dict(sorted(out.items()))

    @property
    def ok(self) -> bool:
        return not any(i.outcome in ("failed", "conflict", "denied") for i in self.items)

    def problems(self) -> list[SyncItem]:
        return [i for i in self.items if i.outcome in ("failed", "conflict", "denied", "blocked")]


# --------------------------------------------------------------------------------------------- selection
def glob_match(rel: str, pattern: str) -> bool:
    regex = "^" + re.escape(pattern).replace(r"\*\*/", "(?:.*/)?").replace(r"\*\*", ".*").replace(r"\*", "[^/]*").replace(r"\?", "[^/]") + "$"
    return re.match(regex, rel) is not None


def selected(rel: str, include: list[str] | None, exclude: list[str] | None) -> bool:
    if include and not any(glob_match(rel, p) for p in include):
        return False
    return not any(glob_match(rel, p) for p in (exclude or []))


def sensitive_reason(path: Path) -> str | None:
    if any(fnmatch.fnmatch(path.name.lower(), pat) for pat in SENSITIVE_NAMES):
        return f"credential-like file name ({path.name}); not published through ordinary sync"
    try:
        with open(path, "rb") as handle:
            if PRIVATE_KEY.search(handle.read(8192)):
                return "contains a private key; not published through ordinary sync"
    except OSError:
        return None
    return None


# ------------------------------------------------------------------------------------------ manifests
def _descriptor_fields(directory: str, root: Path) -> dict:
    d = seeds.read_descriptor(directory, root) or {}
    fields: dict = {}
    if d.get("access"):
        fields["access"] = d["access"]
    if d.get("authorization"):
        fields["access_authorization"] = {k: str(v) for k, v in d["authorization"].items()}
    if d.get("allow_weaker_children"):
        fields["allow_weaker_children"] = True
    for src, dst in (("role", "artifact_role"), ("acquisition_class", "acquisition_class"), ("preparation", "preparation"), ("description", "description")):
        if d.get(src):
            fields[dst] = d[src]
    scope = d.get("scope")
    meta = {"definition": f"seed/{directory + '/' if directory else ''}_folder.yaml"}
    if scope:
        meta["scope"] = scope
        if scope.get("kind") == "jurisdiction":
            fields["jurisdiction_code"] = scope["code"]
    if d.get("review"):
        meta["review"] = d["review"]
    fields["metadata"] = meta
    return fields


def assign_codes(plan: Plan) -> Plan:
    """Derives every code from the root codes (.docs/rules/code-columns.md): a folder takes its parent's code plus the segment of its name, a file takes
    its folder's code plus the segment of its name. Explicit codes are kept and must already sit under their parent. Colliding derived codes are an error."""
    by_path: dict[str, FolderSpec] = {}
    for spec in sorted(plan.folders, key=lambda f: f.path.count("/")):
        parent = spec.path.rsplit("/", 1)[0]
        parent_spec = by_path.get(parent)
        if spec.code is None and parent_spec is not None:
            spec.code = child_code(parent_spec.code, spec.path.rsplit("/", 1)[1])
        by_path[spec.path] = spec
    for f in plan.files:
        folder = by_path.get(f.folder_path)
        if f.code is None and folder is not None:
            f.code = child_code(folder.code, f.name)
    seen: dict[str, str] = {}
    for label, items in (("folder", [(s.code, s.path) for s in plan.folders]), ("file", [(f.code, f"{f.folder_path}/{f.name}") for f in plan.files])):
        for code, where in items:
            if code is None:
                continue
            if not is_code(code):
                raise ManifestError(f"{label} {where}: {code!r} is not a valid code (see .docs/rules/code-columns.md)")
            key = f"{label}:{code}"
            if key in seen:
                raise ManifestError(f"{label} codes collide: {seen[key]} and {where} both become {code}; rename one")
            seen[key] = where
    return plan


def plan_seed(root: Path | None = None, entry_ids: set[str] | None = None) -> Plan:
    """Plan from the root seed manifest: folders mirror the seed directories and carry their descriptor classification; files come from the lock."""
    root = root or SEED_ROOT
    result = seeds.validate_manifest(root)
    if result.errors or not result.manifest:
        raise ManifestError("seed manifest is invalid: " + "; ".join(result.errors[:5]))
    manifest, lock = result.manifest, seeds.build_lock(result.manifest, root)
    by_id = {e["id"]: e for e in manifest["entries"]}
    plan = Plan("seed")
    seen: set[str] = set()
    root_fields = {**_descriptor_fields("", root), "is_seed": True, "description": "Prepared seed artifacts (root seed registry)"}
    plan.folders.append(FolderSpec("/seeds", "seeds", root_fields))  # the only explicit code; everything below derives from it
    for locked in lock["entries"]:
        if entry_ids and locked["id"] not in entry_ids:
            continue
        entry = by_id[locked["id"]]
        mode = entry.get("publication_mode", "versioned")
        for f in locked["files"]:
            parts = f["path"].split("/")
            for i in range(1, len(parts)):
                directory = "/".join(parts[:i])
                logical = "/seeds/" + directory
                if logical not in seen:
                    seen.add(logical)
                    plan.folders.append(FolderSpec(logical, None, _descriptor_fields(directory, root)))
            eff = f["effective"]
            overrides = {k: eff[k] for k in (eff.get("file_override") or []) if k in eff}
            if "role" in (eff.get("file_override") or []):
                overrides["artifact_role"] = overrides.pop("role")
            plan.files.append(FileSpec(
                root / f["path"], "/seeds/" + "/".join(parts[:-1]), parts[-1], None,
                retention="replace_current" if mode == "current" else "preserve_history",
                pin_reason=None if mode == "current" else f"manifest release {manifest['release']}",
                provenance_extra={"manifest_entry": locked["id"], "manifest_release": manifest["release"], "manifest_sha256": lock["manifest_sha256"], "artifact_sha256": f["sha256"],
                                  "input_refs": [f["relocated_from"]] if f.get("relocated_from") else [], "loader": locked["loader"], "review": eff.get("review"),
                                  "generator": {"tool": "mzizi-filesystem sync", "model": None, "note": "no model or generator version is recorded: none is known"},
                                  "effective_overrides": overrides},
                declared_type=None))
    return assign_codes(plan)


def _validator() -> Draft202012Validator:
    schema = json.loads((SCHEMA_ROOT / "filesystem" / "sync-manifest.schema.json").read_text(encoding="utf-8"))
    return Draft202012Validator(schema, format_checker=Draft202012Validator.FORMAT_CHECKER)


def plan_sync_manifest(path: Path, seed_root: Path | None = None) -> Plan:
    """Plan from a generic sync manifest (validated against the schema; no executable expressions, only named fields and globs)."""
    seed_root = seed_root or SEED_ROOT
    doc = yaml.safe_load(path.read_text(encoding="utf-8"))
    errors = sorted(_validator().iter_errors(doc), key=lambda e: list(e.absolute_path))
    if errors:
        raise ManifestError(f"{path}: " + "; ".join(f"{'/'.join(map(str, e.absolute_path)) or '<root>'}: {e.message}" for e in errors[:5]))
    if _touches_raw(doc):
        raise ManifestError("the historical raw collection is excluded from synchronization (it awaits separate reconciliation)")
    base = (seed_root / doc["root"]).resolve()
    if seed_root.resolve() not in base.parents and base != seed_root.resolve():
        raise ManifestError("root escapes the seed root")
    plan = Plan(doc["name"])
    folders: dict[str, FolderSpec] = {}
    logical_root = doc["logical_root"]
    for f in doc.get("folders", []):
        folders[f["path"]] = FolderSpec(f["path"], f.get("code"), _classification(f.get("classification", {}), f.get("description")))
    for entry in doc["entries"]:
        src = entry["source"]
        top = (base / src["path"]).resolve()
        if base not in top.parents and top != base:
            raise ManifestError(f"{entry['id']}: source path escapes the manifest root")
        suffix = "" if src["path"] in (".", "") else "/" + src["path"].strip("./").strip("/")
        entry_folder = entry.get("folder") or f"{logical_root.rstrip('/')}{suffix}"
        cls = entry.get("classification", {})
        if entry_folder not in folders:
            folders[entry_folder] = FolderSpec(entry_folder, entry.get("code"), _classification(cls, entry.get("description")))
        parts_ = [p for p in entry_folder.split("/") if p]
        for i in range(1, len(parts_)):  # every ancestor of the entry folder exists (inheriting) so folders are always created parent-first
            folders.setdefault("/" + "/".join(parts_[:i]), FolderSpec("/" + "/".join(parts_[:i])))
        if not top.exists():
            plan.blocked.append((src["path"], "source path does not exist"))
            continue
        paths = [top] if top.is_file() else sorted(p for p in top.rglob("*") if p.is_file())
        for local in paths:
            rel = local.name if top.is_file() else local.relative_to(top).as_posix()
            if not selected(rel, src.get("include"), src.get("exclude")):
                continue
            reason = None if (entry.get("allow_sensitive") and cls.get("access") == "private") else sensitive_reason(local)
            if reason:
                plan.blocked.append((local.relative_to(seed_root).as_posix(), reason))
                continue
            parts = rel.split("/")
            folder = entry_folder
            if not entry.get("flatten") and len(parts) > 1:
                for i in range(1, len(parts)):
                    folder = f"{entry_folder}/" + "/".join(parts[:i])
                    folders.setdefault(folder, FolderSpec(folder))
                folder = f"{entry_folder}/" + "/".join(parts[:-1])
            code = entry.get("identities", {}).get(rel)  # explicit override only; otherwise derived from the folder code
            plan.files.append(FileSpec(local, folder, parts[-1], code, entry.get("retention") or doc.get("defaults", {}).get("retention", "preserve_history"),
                                       entry.get("pin_reason"), {"manifest": doc["name"], "manifest_release": doc.get("release"), "manifest_entry": entry["id"], "review": cls.get("review"), "note": entry.get("note")}))
    plan.folders = sorted(folders.values(), key=lambda f: f.path.count("/"))
    return assign_codes(plan)


def _touches_raw(doc: dict) -> bool:
    """`raw` (the old .data/raw collection) may not be a manifest root, a source path or a logical folder."""
    def raw(path: str) -> bool:
        return "raw" in [p for p in re.split(r"[/\\]", path) if p]

    paths = [doc["root"], doc["logical_root"]] + [f["path"] for f in doc.get("folders", [])]
    for e in doc["entries"]:
        paths += [e["source"]["path"], e.get("folder") or ""] + e["source"].get("include", [])
    return any(raw(p) for p in paths if p)


def _classification(cls: dict, description: str | None) -> dict:
    fields = {k: cls[k] for k in ("access", "artifact_role", "acquisition_class", "preparation", "is_seed", "jurisdiction_code", "allow_weaker_children") if k in cls}
    if cls.get("access_authorization"):
        fields["access_authorization"] = cls["access_authorization"]
    if description:
        fields["description"] = description
    meta = {k: cls[k] for k in ("review", "scope", "origin_note") if k in cls}
    if meta:
        fields["metadata"] = meta
    return fields


def load_plan(manifest: Path, seed_root: Path | None = None, entry_ids: set[str] | None = None) -> Plan:
    doc = yaml.safe_load(manifest.read_text(encoding="utf-8"))
    if isinstance(doc, dict) and doc.get("kind") == "filesystem-sync":
        return plan_sync_manifest(manifest, seed_root)
    if manifest.resolve() != ((seed_root or SEED_ROOT) / "manifest.yaml").resolve():
        raise ManifestError("not a sync manifest and not the root seed manifest")
    return plan_seed(seed_root, entry_ids)


# --------------------------------------------------------------------------------------------- execution
def _ensure_folder(repo: Repository, authorizer: Authorizer, actor: str | None, spec: FolderSpec, ids: dict[str, str | None], dry_run: bool) -> SyncItem:
    parts = [p for p in spec.path.split("/") if p]
    parent_path = "/" + "/".join(parts[:-1]) if len(parts) > 1 else ""
    parent_id = ids.get(parent_path) if parent_path else None
    if parent_path and parent_id is None and parent_path not in ids:
        return SyncItem("folder", spec.path, "failed", "parent folder is not planned")
    existing = repo.folder_by_code(spec.code) if spec.code else None
    if existing is None and (parent_id is not None or not parent_path):
        existing = repo.find_folder(parent_id, parts[-1])
    if existing:
        ids[spec.path] = existing["id"]
        changed = {k: v for k, v in spec.fields.items() if v is not None and existing.get(k) != v and k != "metadata"}
        if "access" in changed and existing.get("access") not in (None, changed["access"]):
            return SyncItem("folder", spec.path, "conflict", f"access is {existing['access']} and the spec asks {changed['access']}: use an explicit access transition")
        if spec.fields.get("metadata") and existing["metadata"] != spec.fields["metadata"]:
            changed["metadata"] = spec.fields["metadata"]
        if not changed:
            return SyncItem("folder", spec.path, "unchanged")
        if dry_run:
            return SyncItem("folder", spec.path, "planned", action="update " + ",".join(sorted(changed)))
        try:
            authorizer.for_record(actor, "filesystem.edit", "filesystem.folders", existing["id"])
            repo.update_folder(existing["id"], existing["revision"], changed)
        except (Conflict, PermissionDenied, psycopg.Error) as error:
            return SyncItem("folder", spec.path, "denied" if isinstance(error, PermissionDenied) else "conflict", str(error).splitlines()[0])
        return SyncItem("folder", spec.path, "updated")
    if dry_run:
        ids[spec.path] = None
        return SyncItem("folder", spec.path, "planned", action="create")
    try:
        authorizer.for_new_child(actor, "filesystem.edit", "filesystem.folders", parent_id)
        with repo.transaction():
            row = repo.create_folder(parent_id, parts[-1], {**spec.fields, "code": spec.code}, actor)
    except PermissionDenied as error:
        ids[spec.path] = None
        return SyncItem("folder", spec.path, "denied", str(error))
    except psycopg.Error as error:
        ids[spec.path] = None
        return SyncItem("folder", spec.path, "failed", str(error).splitlines()[0])
    ids[spec.path] = row["id"]
    return SyncItem("folder", spec.path, "created")


def run_sync(plan: Plan, service: FilesystemService, *, actor: str | None = None, dry_run: bool = True, authorizer: Authorizer | None = None) -> SyncReport:
    repo = service.repo
    authorizer = authorizer or service.authorizer
    report = SyncReport(plan.name, dry_run)
    ids: dict[str, str | None] = {"": None}
    for spec in sorted(plan.folders, key=lambda f: f.path.count("/")):
        item = _ensure_folder(repo, authorizer, actor, spec, ids, dry_run)
        report.items.append(item)
        if item.outcome in ("failed", "denied", "conflict") and spec.path not in ids:
            ids[spec.path] = None
    for local, reason in plan.blocked:
        report.items.append(SyncItem("file", local, "blocked", reason))
    for f in plan.files:
        folder_id = ids.get(f.folder_path)
        if folder_id is None:
            path = f"{f.folder_path}/{f.name}"
            if dry_run and f.folder_path in ids:
                report.items.append(SyncItem("file", path, "planned", action="create (folder will be created)"))
            else:
                report.items.append(SyncItem("file", path, "failed", "folder unavailable (see folder results)"))
            continue
        r: Registration = service.register(folder_id, f.name, f.local, code=f.code, retention=f.retention, actor=actor, provenance_extra=f.provenance_extra,
                                           declared_type=f.declared_type, pin_reason=f.pin_reason, dry_run=dry_run)
        report.items.append(SyncItem("file", f"{f.folder_path}/{f.name}", r.outcome, r.detail, r.action, r.key, r.reused_storage, r.recovered, r.verified, r.revision))
    return report
