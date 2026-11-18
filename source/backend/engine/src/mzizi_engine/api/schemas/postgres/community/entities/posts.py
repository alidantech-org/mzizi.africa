"""Posts: one row of posts."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from mzizi_engine.api.schemas.postgres.community.enums.moderation_state import ModerationState
from mzizi_engine.api.schemas.postgres.shared.enums.subject_table import SubjectTable


class PostsRow(BaseModel):
    """One thing an actor posted about a subject: a comment, evidence, an opinion, a photo, a ground-truth report, a correction or a data request. Never canonical data until reviewed; media attach to it as to any subject."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "community.posts"

    actor_id: UUID
    addressee_feature_id: UUID | None = None
    body: Annotated[str, Field(min_length=1)] | None = None
    country_id: UUID | None = None
    created_at: datetime
    deleted_at: datetime | None = None
    device_id: UUID
    id: UUID
    kind_id: UUID
    language_id: UUID | None = None
    location_proof_id: UUID | None = None
    parent_interaction_id: UUID | None = None
    published_at: datetime | None = None
    state: ModerationState
    subject_id: UUID
    subject_table: SubjectTable
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
