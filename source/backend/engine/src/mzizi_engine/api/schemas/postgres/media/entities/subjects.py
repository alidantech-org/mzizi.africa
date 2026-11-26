"""Subjects: one row of subjects."""

from __future__ import annotations

from datetime import datetime
from typing import ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from mzizi_engine.api.schemas.postgres.shared.enums.subject_role import SubjectRole


class MediaSubjectsRow(BaseModel):
    """The named things an article is about, beyond its main identity (section 34.5)."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "media.subjects"

    article_id: UUID
    created_at: datetime
    deleted_at: datetime | None = None
    id: UUID
    identity_id: UUID
    role: SubjectRole
