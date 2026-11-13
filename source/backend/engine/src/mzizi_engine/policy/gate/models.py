"""Typed assessment, scope and condition contracts for the collection gate."""

from __future__ import annotations

from datetime import datetime
from enum import StrEnum
from typing import Literal

from pydantic import Field

from mzizi_engine.policy.models import External, Frozen
from mzizi_fetch import FetchMode, Purpose


class LegalStatus(StrEnum):
    NOT_REVIEWED = "not_reviewed"
    IN_REVIEW = "in_review"
    APPROVED = "approved"
    APPROVED_WITH_CONDITIONS = "approved_with_conditions"
    EXPIRED = "expired"
    RESTRICTED = "restricted"
    REJECTED = "rejected"


APPROVING = frozenset({LegalStatus.APPROVED, LegalStatus.APPROVED_WITH_CONDITIONS})
ASSESSABLE = frozenset(
    {
        LegalStatus.NOT_REVIEWED,
        LegalStatus.IN_REVIEW,
        LegalStatus.APPROVED,
        LegalStatus.APPROVED_WITH_CONDITIONS,
        LegalStatus.EXPIRED,
    }
)
PILOT_OR_PRODUCTION = frozenset({"pilot", "production"})
NO_PERSONAL_DATA = "none_known"


class PathRules(External):
    allow: tuple[str, ...] = ()
    deny: tuple[str, ...] = ()


class ApprovedScope(External):
    hosts: tuple[str, ...]
    schemes: tuple[str, ...] = ("https",)
    paths: PathRules = PathRules()
    fetch_modes: tuple[FetchMode, ...] = Field(default=(FetchMode.HTTP, FetchMode.API), alias="fetchModes")
    max_requests_per_second: float | None = Field(default=None, alias="maxRequestsPerSecond")
    purposes: tuple[Purpose, ...] = ()


class MaxRequestsPerSecond(External):
    type: Literal["max_requests_per_second"] = "max_requests_per_second"
    value: float


class NoPublish(External):
    type: Literal["no_publish"] = "no_publish"


class AttributionRequired(External):
    type: Literal["attribution_required"] = "attribution_required"


class ExcludedPaths(External):
    type: Literal["excluded_paths"] = "excluded_paths"
    value: tuple[str, ...]


class UnenforceableCondition(External):
    """A condition the engine cannot enforce; it denies the request."""

    type: str


type Condition = MaxRequestsPerSecond | NoPublish | AttributionRequired | ExcludedPaths | UnenforceableCondition


class Assessment(Frozen):
    id: str | None
    status: LegalStatus
    jurisdiction_id: str | None
    personal_data_categories: tuple[str, ...]
    lawful_basis: str | None
    approved_scope: ApprovedScope | None
    conditions: tuple[Condition, ...]
    reviewed_by: str | None
    reviewed_at: datetime | None
    review_due_at: datetime | None


class ParsedAssessment(Frozen):
    """An assessment (or none) and the problems found while reading it; problems become denial reasons."""

    assessment: Assessment | None
    problems: tuple[str, ...] = ()
