"""Preserve the files our data came from: register them in the filesystem store and link the records that describe them.

Two kinds of file are registered, both under caller-chosen folders (nothing here is a package default):

- the downloaded originals listed in `seed/data/<scope>/source/_files.yaml` (an artifact code, its product, where the local
  copy is, who gets the credit and what the rights are), under `sources/downloads/<product code>/`;
- every seed CSV artifact the catalogue lists (`seed.artifacts.csv`), under `seed/<path below data/>`.

For each file the store keeps the bytes and a version row with the sha256. The same run then sets `file_version_id` on the
`source.artifacts` row, and writes one `source.attributions` row per downloaded artifact (credit and rights tied to the
artifact, whose bytes are the exact stored version). Running again registers nothing new: the filesystem package sees the same bytes
and reports `unchanged`, and the update statements change nothing. A dry run plans without touching the store or the database.
"""

from __future__ import annotations

import csv
from collections import Counter
from collections.abc import Sequence
from dataclasses import dataclass
from pathlib import Path
from uuid import UUID

import yaml
from pydantic import BaseModel, ConfigDict

from mzizi_engine.persistence.postgres.connection import Connection
from mzizi_engine.persistence.postgres.reference import PostgresReference
from mzizi_filesystem import (
    Access,
    DuplicatePolicy,
    FilesystemOrchestrator,
    NameConflictPolicy,
    RegisterRequest,
    Retention,
)
from mzizi_filesystem.features.placement.contracts import Placement
from mzizi_manifest.features.codes.glossary import load_glossary
from mzizi_manifest.features.codes.grammar import stored_code
from mzizi_manifest.features.seeds.ids import stable_id

DOWNLOAD_ROLE = "source-download"
SEED_ROLE = "seed-data"


class FileEntry(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    #: Path of the local copy, relative to the repository root.
    path: str
    #: The product the artifact is a representation of; its folder under `sources/downloads/`.
    product: str
    credit: str
    rights: str


class FilesDocument(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    #: Artifact code to its file.
    artifacts: dict[str, FileEntry]


@dataclass(frozen=True)
class Planned:
    kind: str  # "download" or "seed"
    code: str
    path: Path
    folders: tuple[str, ...]
    role: str


class FilesReport(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    applied: bool
    files: int
    outcomes: dict[str, int]
    attributions: int
    problems: tuple[str, ...]

    @property
    def ok(self) -> bool:
        return not self.problems


def _rows(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def plan_files(seed_root: Path) -> tuple[list[Planned], dict[str, FileEntry]]:
    """Every file to register and the credit entries of the downloaded originals."""
    repo = seed_root.parent
    planned: list[Planned] = []
    entries: dict[str, FileEntry] = {}
    for listing in sorted((seed_root / "data").rglob("_files.yaml")):
        document = FilesDocument.model_validate(yaml.safe_load(listing.read_text(encoding="utf-8")))
        for code, entry in document.artifacts.items():
            entries[code] = entry
            planned.append(
                Planned("download", code, repo / entry.path, ("sources", "downloads", entry.product), DOWNLOAD_ROLE)
            )
    catalogue = seed_root / "data" / "global" / "source" / "seed.artifacts.csv"
    for row in _rows(catalogue) if catalogue.is_file() else []:
        path = repo / row["location"]
        below = path.relative_to(seed_root / "data").parts
        planned.append(Planned("seed", row["code"], path, ("seed", *below[:-1]), SEED_ROLE))
    return planned, entries


def register_files(
    fs: FilesystemOrchestrator,
    conn: Connection,
    seed_root: Path,
    *,
    apply: bool,
    created_by: dict[str, str],
    items: Sequence[Planned] | None = None,
) -> FilesReport:
    planned, entries = plan_files(seed_root)
    chosen = list(items) if items is not None else planned
    roles = PostgresReference(conn).role_ids({i.role for i in chosen}, create=apply)
    outcomes: Counter[str] = Counter()
    problems: list[str] = []
    attributions = 0
    for item in chosen:
        if not item.path.is_file():
            problems.append(f"{item.code}: the file {item.path} is not here")
            continue
        request = RegisterRequest(
            placement=Placement(
                folders=item.folders,
                file_name=item.path.name,
                access=Access.INTERNAL,
                retention=Retention.PRESERVE_HISTORY,
                role_id=roles.get(item.role, "dry-run"),
                authorization="source data kept for provenance",
            ),
            file_code=None,
            declared_type=None,
            original_filename=item.path.name,
            provenance={"kind": item.kind, "code": item.code},
            created_by=created_by,
            on_name_conflict=NameConflictPolicy.NEW_VERSION,
            on_duplicate=DuplicatePolicy.REUSE_EXISTING,
            pinned=item.kind == "download",
            dry_run=not apply,
        )
        result = fs.register(request, item.path)
        outcomes[result.outcome.value] += 1
        if result.outcome.value in ("failed", "conflict"):
            problems.append(f"{item.code}: {result.outcome.value}: {result.detail}")
            continue
        if not apply or result.version_id is None:
            continue
        table = "source.artifacts"
        record = stable_id(table, item.code)
        updated = conn.execute(
            f"UPDATE {table} SET file_version_id = %s, updated_at = now(), version = version + 1 "
            "WHERE id = %s AND file_version_id IS DISTINCT FROM %s",
            (UUID(result.version_id), record, UUID(result.version_id)),
        )
        if updated.rowcount == 0 and not conn.execute(f"SELECT 1 FROM {table} WHERE id = %s", (record,)).fetchone():
            problems.append(f"{item.code}: no {table} row; seed first")
        if item.kind == "download" and item.code in entries:
            attributions += _attribute(conn, item.code, entries[item.code], UUID(result.version_id))
    if apply:
        conn.commit()
    return FilesReport(
        applied=apply, files=len(chosen), outcomes=dict(outcomes), attributions=attributions, problems=tuple(problems)
    )


def _attribute(conn: Connection, code: str, entry: FileEntry, version: UUID) -> int:
    """One attribution per stored artifact: its product's publisher, the credit and the rights, assessed now."""
    artifact = conn.execute(
        "SELECT a.id, p.publisher_id FROM source.artifacts a JOIN source.editions e ON e.id = a.edition_id "
        "JOIN source.products p ON p.id = e.product_id WHERE a.id = %s",
        (stable_id("source.artifacts", code),),
    ).fetchone()
    if artifact is None or artifact["publisher_id"] is None:
        return 0
    identity = f"{code}~{str(version)[:8]}"
    row_id = stable_id("source.attributions", identity)
    stored = stored_code(load_glossary().tables["source.attributions"], identity)
    done = conn.execute(
        "INSERT INTO source.attributions (id, code, version, created_at, updated_at, publisher_id, artifact_id, credit, "
        "rights_statement, assessed_at, assessor_snapshot) VALUES (%s, %s, 1, now(), now(), %s, %s, %s, %s, now(), %s) "
        "ON CONFLICT (id) DO NOTHING",
        (
            row_id,
            stored,
            artifact["publisher_id"],
            artifact["id"],
            entry.credit,
            entry.rights,
            '{"task": "register source files"}',
        ),
    )
    return done.rowcount
