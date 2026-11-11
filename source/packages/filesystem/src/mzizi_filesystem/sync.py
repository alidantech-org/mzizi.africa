"""Seed synchronization: plan and apply the folders and files of `seed/manifest.yaml` through the filesystem service.

There is one manifest. The plan mirrors the local tree: `seed/<path>` becomes the registry path `<logical_root>/<path>` and, because
the object key is the registry path, the object `<access><logical_root>/<path>`. Folders carry the classification of their
`_folder.yaml`; files carry the versioning stated by their manifest entry. Identity is the registry code derived from the path. A
file that disappears locally is reported by nothing and deleted nowhere.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path

import psycopg

from mzizi_manifest import seed_registry as seeds
from mzizi_manifest.paths import SEED_ROOT

from .authz import Authorizer
from .codes import child_code, is_code
from .repository import Conflict, PermissionDenied, Repository
from .service import FilesystemService, Registration


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
    expected_key: str | None = None  # the key the lock planned; the registered key must equal it


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
    duplicate_of: str | None = None
    server_copied: bool = False
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


# ------------------------------------------------------------------------------------------ manifest
def _descriptor_fields(directory: str, root: Path) -> dict:
    d = seeds.read_descriptor(directory, root) or {}
    fields: dict = {}
    if d.get("access"):
        fields["access"] = d["access"]
    if d.get("authorization"):
        fields["access_authorization"] = {k: str(v) for k, v in d["authorization"].items()}
    if d.get("allow_weaker_children"):
        fields["allow_weaker_children"] = True
    for src, dst in (
        ("role", "artifact_role"),
        ("acquisition_class", "acquisition_class"),
        ("preparation", "preparation"),
        ("description", "description"),
    ):
        if d.get(src):
            fields[dst] = d[src]
    if d.get("seed") is not None:
        fields["is_seed"] = bool(d["seed"])
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
    for label, items in (
        ("folder", [(s.code, s.path) for s in plan.folders]),
        ("file", [(f.code, f"{f.folder_path}/{f.name}") for f in plan.files]),
    ):
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
    """Plan from the seed manifest: one folder per seed directory under the logical root, one file per manifest-covered file."""
    root = root or SEED_ROOT
    result = seeds.validate_manifest(root)
    if result.errors or not result.manifest:
        raise ManifestError("seed manifest is invalid: " + "; ".join(result.errors[:5]))
    manifest = result.manifest
    logical_root, manifest_hash = manifest["logical_root"], seeds.manifest_sha256(root)
    plan = Plan("seed")
    seen: set[str] = set()
    root_fields = {
        **_descriptor_fields("", root),
        "is_seed": True,
        "description": "Prepared seed artifacts (root seed registry)",
    }
    plan.folders.append(
        FolderSpec(logical_root, manifest["root_code"], root_fields)
    )  # the only explicit code; everything below derives from it
    for f in seeds.resolve_files(manifest, root):
        if entry_ids and f["entry"] not in entry_ids:
            continue
        parts = f["path"].split("/")
        for i in range(1, len(parts)):
            directory = "/".join(parts[:i])
            logical = f"{logical_root}/{directory}"
            if logical not in seen:
                seen.add(logical)
                plan.folders.append(FolderSpec(logical, None, _descriptor_fields(directory, root)))
        eff = f["effective"]
        overrides = {k: eff[k] for k in (eff.get("file_override") or []) if k in eff}
        if "role" in overrides:
            overrides["artifact_role"] = overrides.pop("role")
        plan.files.append(
            FileSpec(
                root / f["path"],
                f"{logical_root}/" + "/".join(parts[:-1]),
                parts[-1],
                None,
                retention="replace_current" if f["versioning"] == "current" else "preserve_history",
                pin_reason=f"manifest release {manifest['release']}" if f["pin"] else None,
                provenance_extra={
                    "manifest_entry": f["entry"],
                    "manifest_release": manifest["release"],
                    "manifest_sha256": manifest_hash,
                    "artifact_sha256": f["sha256"],
                    "input_refs": [f["origin"]] if f.get("origin") else [],
                    "loader": f["loader"],
                    "review": eff.get("review"),
                    "local_path": f"seed/{f['path']}",
                    "generator": {
                        "tool": "mzizi-filesystem sync",
                        "model": None,
                        "note": "no model or generator version is recorded: none is known",
                    },
                    "effective_overrides": overrides,
                },
                expected_key=f["key"],
            )
        )
    return assign_codes(plan)


def load_plan(manifest: Path, seed_root: Path | None = None, entry_ids: set[str] | None = None) -> Plan:
    """Only the root seed manifest can be synchronized; there is no second manifest kind."""
    root = seed_root or SEED_ROOT
    if manifest.resolve() != (root / seeds.MANIFEST_NAME).resolve():
        raise ManifestError(f"only {root / seeds.MANIFEST_NAME} can be synchronized")
    return plan_seed(root, entry_ids)


# --------------------------------------------------------------------------------------------- execution
def _ensure_folder(
    repo: Repository,
    authorizer: Authorizer,
    actor: str | None,
    spec: FolderSpec,
    ids: dict[str, str | None],
    dry_run: bool,
) -> SyncItem:
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
            return SyncItem(
                "folder",
                spec.path,
                "conflict",
                f"access is {existing['access']} and the spec asks {changed['access']}: use an explicit access transition",
            )
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
            return SyncItem(
                "folder",
                spec.path,
                "denied" if isinstance(error, PermissionDenied) else "conflict",
                str(error).splitlines()[0],
            )
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


def run_sync(
    plan: Plan,
    service: FilesystemService,
    *,
    actor: str | None = None,
    dry_run: bool = True,
    authorizer: Authorizer | None = None,
) -> SyncReport:
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
        r: Registration = service.register(
            folder_id,
            f.name,
            f.local,
            code=f.code,
            retention=f.retention,
            actor=actor,
            provenance_extra=f.provenance_extra,
            declared_type=f.declared_type,
            pin_reason=f.pin_reason,
            dry_run=dry_run,
        )
        if (
            f.expected_key
            and r.key
            and r.key != f.expected_key
            and r.outcome not in ("failed", "conflict", "denied", "blocked")
        ):
            r.outcome, r.detail = (
                "failed",
                f"registered key {r.key} differs from the key planned by the lock ({f.expected_key})",
            )
        report.items.append(
            SyncItem(
                "file",
                f"{f.folder_path}/{f.name}",
                r.outcome,
                r.detail,
                r.action,
                r.key,
                r.duplicate_of,
                r.server_copied,
                r.recovered,
                r.verified,
                r.revision,
            )
        )
    return report
