"""Preserve the files our data came from: register them in the filesystem store and link the records that describe them.

Two kinds of file are registered, both under caller-chosen folders (nothing here is a package default):

- the downloaded originals listed in `seed/data/<scope>/source/_files.yaml` (a document code, where the local copy is, who
  gets the credit and what the rights are), under `sources/downloads/<source code>/`;
- every seed CSV the datasets table lists, under `seed/<path below data/>`.

For each file the store keeps the bytes and a version row with the sha256. The same run then sets `file_version_id` on the
`source.documents` or `source.datasets` row, and writes one `source.attributions` row per downloaded document (credit and
rights tied to the exact stored version). Running again registers nothing new: the filesystem package sees the same bytes
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
from mzizi_manifest.features.seeds.ids import stable_id

DOWNLOAD_ROLE = "source-download"
SEED_ROLE = "seed-data"


class FileEntry(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    #: Path of the local copy, relative to the repository root.
    path: str
    credit: str
    rights: str


class FilesDocument(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    #: Document code to its file.
    documents: dict[str, FileEntry]


@dataclass(frozen=True)
class Planned:
    kind: str  # "document" or "dataset"
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


def plan_files(seed_root: Path) -> tuple[list[Planned], dict[str, FileEntry], dict[str, str]]:
    """Every file to register, the credit entries, and each document's source code."""
    repo = seed_root.parent
    planned: list[Planned] = []
    entries: dict[str, FileEntry] = {}
    source_of: dict[str, str] = {}
    for listing in sorted((seed_root / "data").rglob("_files.yaml")):
        document = FilesDocument.model_validate(yaml.safe_load(listing.read_text(encoding="utf-8")))
        captures = _rows(listing.parent / "captures.csv") if (listing.parent / "captures.csv").is_file() else []
        for capture in captures:
            if capture.get("document_code"):
                source_of[capture["document_code"]] = capture["source_code"]
        for code, entry in document.documents.items():
            entries[code] = entry
            folder = source_of.get(code, "unsorted")
            planned.append(
                Planned("document", code, repo / entry.path, ("sources", "downloads", folder), DOWNLOAD_ROLE)
            )
    datasets = seed_root / "data" / "global" / "source" / "datasets.csv"
    for row in _rows(datasets) if datasets.is_file() else []:
        path = repo / row["location"]
        below = path.relative_to(seed_root / "data").parts
        planned.append(Planned("dataset", row["code"], path, ("seed", *below[:-1]), SEED_ROLE))
    return planned, entries, source_of


def register_files(
    fs: FilesystemOrchestrator,
    conn: Connection,
    seed_root: Path,
    *,
    apply: bool,
    created_by: dict[str, str],
    items: Sequence[Planned] | None = None,
) -> FilesReport:
    planned, entries, _ = plan_files(seed_root)
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
            pinned=item.kind == "document",
            dry_run=not apply,
        )
        result = fs.register(request, item.path)
        outcomes[result.outcome.value] += 1
        if result.outcome.value in ("failed", "conflict"):
            problems.append(f"{item.code}: {result.outcome.value}: {result.detail}")
            continue
        if not apply or result.version_id is None:
            continue
        table = "source.documents" if item.kind == "document" else "source.datasets"
        record = stable_id(table, item.code)
        updated = conn.execute(
            f"UPDATE {table} SET file_version_id = %s, updated_at = now(), version = version + 1 "
            "WHERE id = %s AND file_version_id IS DISTINCT FROM %s",
            (UUID(result.version_id), record, UUID(result.version_id)),
        )
        if updated.rowcount == 0 and not conn.execute(f"SELECT 1 FROM {table} WHERE id = %s", (record,)).fetchone():
            problems.append(f"{item.code}: no {table} row; seed first")
        if item.kind == "document" and item.code in entries:
            attributions += _attribute(conn, item.code, entries[item.code], UUID(result.version_id))
    if apply:
        conn.commit()
    return FilesReport(
        applied=apply, files=len(chosen), outcomes=dict(outcomes), attributions=attributions, problems=tuple(problems)
    )


def _attribute(conn: Connection, code: str, entry: FileEntry, version: UUID) -> int:
    """One attribution per stored document version: its publisher, the credit and the rights, assessed now."""
    document = conn.execute(
        "SELECT id, publisher_id FROM source.documents WHERE id = %s", (stable_id("source.documents", code),)
    ).fetchone()
    if document is None or document["publisher_id"] is None:
        return 0
    row_id = stable_id("source.attributions", f"{code}|{version}")
    done = conn.execute(
        "INSERT INTO source.attributions (id, version, created_at, updated_at, publisher_id, file_version_id, credit, "
        "rights_statement, assessed_at, assessor_snapshot) VALUES (%s, 1, now(), now(), %s, %s, %s, %s, now(), %s) "
        "ON CONFLICT (id) DO NOTHING",
        (row_id, document["publisher_id"], version, entry.credit, entry.rights, '{"task": "register source files"}'),
    )
    return done.rowcount
