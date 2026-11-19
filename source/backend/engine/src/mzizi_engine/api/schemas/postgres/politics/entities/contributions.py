"""Contributions: one row of contributions."""

from __future__ import annotations

from datetime import date, datetime
from typing import Annotated, ClassVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ContributionsRow(BaseModel):
    """Money or goods given to a party or candidate, by whom, when, for which election and where it was disclosed. A recorded gift is a fact about a gift, never a claim about intent."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    table: ClassVar[str] = "politics.contributions"

    amount_minor_units: Annotated[int, Field(ge=0)]
    code: Annotated[
        str,
        Field(
            min_length=1,
            max_length=255,
            pattern="^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
        ),
    ]
    created_at: datetime
    currency_id: UUID
    deleted_at: datetime | None = None
    disclosure_file_version_id: UUID | None = None
    donor_entity_id: UUID | None = None
    donor_individual_id: UUID | None = None
    election_id: UUID | None = None
    evidence_status_id: UUID
    given_on: date
    id: UUID
    is_in_kind: bool
    recipient_candidate_id: UUID | None = None
    recipient_party_id: UUID | None = None
    source_citation_id: UUID | None = None
    updated_at: datetime
    version: Annotated[int, Field(ge=1)]
