"""Register media files and the media rows that use them, from a reviewed drafts folder.

A drafts folder holds `media.csv` (one row per media: its code, the subject table and code it belongs to, the media kind,
title, alternative text, the file path below the folder's `files` root, the file's sha256 and a `metadata` JSON object). For each
row the file is stored in the filesystem store (a public folder, so a browser can show it), then one `filesystem.media` row is
written that points at the stored version and the subject, carrying the metadata. Running again changes nothing: the store
reports the same bytes as unchanged and the row is updated in place. A dry run plans without touching the store or the database.
"""

from __future__ import annotations

import csv
import hashlib
import json
from collections import Counter
from dataclasses import dataclass
from pathlib import Path
from uuid import UUID

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

MEDIA_ROLE = "media-file"


class MediaReport(BaseModel):
    model_config = ConfigDict(frozen=True)

    applied: bool
    media: int
    outcomes: dict[str, int]
    problems: tuple[str, ...]

    @property
    def ok(self) -> bool:
        return not self.problems


@dataclass(frozen=True)
class MediaDraft:
    code: str
    subject_table: str
    subject_code: str
    kind_code: str
    title: str
    alt_text: str
    path: Path
    sha256: str
    metadata: dict[str, object]


def read_drafts(folder: Path, files_root: Path) -> list[MediaDraft]:
    with (folder / "media.csv").open(encoding="utf-8", newline="") as handle:
        rows = list(csv.DictReader(handle))
    drafts: list[MediaDraft] = []
    for row in rows:
        metadata = json.loads(row["metadata"]) if row["metadata"] else {}
        if not isinstance(metadata, dict):
            raise ValueError(f"{row['code']}: metadata must be a JSON object")
        drafts.append(
            MediaDraft(
                code=row["code"],
                subject_table=row["subject_table"],
                subject_code=row["subject_code"],
                kind_code=row["kind_code"],
                title=row["title"],
                alt_text=row["alt_text"],
                path=files_root / row["file"],
                sha256=row["sha256"],
                metadata=metadata,
            )
        )
    return drafts


def register_media(
    fs: FilesystemOrchestrator,
    conn: Connection,
    drafts: list[MediaDraft],
    *,
    folders: tuple[str, ...],
    apply: bool,
    created_by: dict[str, str],
) -> MediaReport:
    roles = PostgresReference(conn).role_ids({MEDIA_ROLE}, create=apply)
    outcomes: Counter[str] = Counter()
    problems: list[str] = []
    for draft in drafts:
        if not draft.path.is_file():
            problems.append(f"{draft.code}: the file {draft.path} is not here")
            continue
        if hashlib.sha256(draft.path.read_bytes()).hexdigest() != draft.sha256:
            problems.append(f"{draft.code}: the file does not match its recorded sha256")
            continue
        result = fs.register(
            RegisterRequest(
                placement=Placement(
                    folders=folders,
                    file_name=draft.path.name,
                    access=Access.PUBLIC,
                    retention=Retention.PRESERVE_HISTORY,
                    role_id=roles.get(MEDIA_ROLE, "dry-run"),
                    authorization="public media shown with the record it belongs to",
                ),
                file_code=None,
                declared_type=None,
                original_filename=draft.path.name,
                provenance={"kind": "media", "code": draft.code},
                created_by=created_by,
                on_name_conflict=NameConflictPolicy.NEW_VERSION,
                on_duplicate=DuplicatePolicy.REUSE_EXISTING,
                pinned=False,
                dry_run=not apply,
            ),
            draft.path,
        )
        outcomes[result.outcome.value] += 1
        if result.outcome.value in ("failed", "conflict"):
            problems.append(f"{draft.code}: {result.outcome.value}: {result.detail}")
            continue
        if not apply or result.version_id is None:
            continue
        kind = conn.execute(
            'SELECT id FROM reference."values" WHERE code = %s AND deleted_at IS NULL', ("ref.val." + draft.kind_code,)
        ).fetchone()
        if kind is None:
            kind = conn.execute(
                'SELECT id FROM reference."values" WHERE code = %s AND deleted_at IS NULL', (draft.kind_code,)
            ).fetchone()
        if kind is None:
            problems.append(f"{draft.code}: media kind {draft.kind_code} is not seeded")
            continue
        subject = stable_id(draft.subject_table, draft.subject_code)
        if conn.execute(f"SELECT 1 FROM {draft.subject_table} WHERE id = %s", (subject,)).fetchone() is None:
            problems.append(f"{draft.code}: subject {draft.subject_table} {draft.subject_code} is not seeded")
            continue
        media_id = stable_id("filesystem.media", draft.code)
        conn.execute(
            "INSERT INTO filesystem.media (id, code, version, created_at, updated_at, kind_id, title, alt_text, "
            "file_version_id, subject_table, subject_id, metadata) "
            "VALUES (%s, %s, 1, now(), now(), %s, %s, %s, %s, %s, %s, %s::jsonb) "
            "ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, alt_text = EXCLUDED.alt_text, "
            "file_version_id = EXCLUDED.file_version_id, metadata = EXCLUDED.metadata, updated_at = now(), "
            "version = filesystem.media.version + 1",
            (
                media_id,
                f"fil.med.{draft.code}",
                kind["id"],
                draft.title,
                draft.alt_text or None,
                UUID(result.version_id),
                draft.subject_table,
                subject,
                json.dumps(draft.metadata),
            ),
        )
    if apply:
        conn.commit()
    return MediaReport(applied=apply, media=len(drafts), outcomes=dict(outcomes), problems=tuple(problems))
