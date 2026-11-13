"""Parsing boundary for assessment rows. JSON-in-text columns are decoded here and nowhere else."""

from __future__ import annotations

import json
from datetime import UTC, datetime

from pydantic import BaseModel, ConfigDict, Field, TypeAdapter, ValidationError

from mzizi_fetch import FetchMode, GateRequest, Purpose

from .models import (
    ApprovedScope,
    Assessment,
    AttributionRequired,
    Condition,
    ExcludedPaths,
    LegalStatus,
    MaxRequestsPerSecond,
    NoPublish,
    ParsedAssessment,
    UnenforceableCondition,
)

_CONDITION_TYPES: dict[str, TypeAdapter[Condition]] = {
    "max_requests_per_second": TypeAdapter(MaxRequestsPerSecond),
    "no_publish": TypeAdapter(NoPublish),
    "attribution_required": TypeAdapter(AttributionRequired),
    "excluded_paths": TypeAdapter(ExcludedPaths),
}
_STRINGS: TypeAdapter[tuple[str, ...]] = TypeAdapter(tuple[str, ...])
_SCOPE: TypeAdapter[ApprovedScope] = TypeAdapter(ApprovedScope)
_CONDITION_LIST: TypeAdapter[list[dict[str, object]]] = TypeAdapter(list[dict[str, object]])


class _Row(BaseModel):
    """The assessment row as the database service returns it (camelCase, JSON stored as text)."""

    model_config = ConfigDict(extra="ignore", populate_by_name=True)

    id: str | None = None
    status: LegalStatus
    jurisdiction_id: str | None = Field(default=None, alias="jurisdictionId")
    personal_data_categories: str | list[str] | None = Field(default=None, alias="personalDataCategories")
    lawful_basis: str | None = Field(default=None, alias="lawfulBasis")
    approved_scope: str | dict[str, object] | None = Field(default=None, alias="approvedScope")
    conditions: str | list[dict[str, object]] | None = None
    reviewed_by: str | None = Field(default=None, alias="reviewedBy")
    reviewed_at: datetime | None = Field(default=None, alias="reviewedAt")
    review_due_at: datetime | None = Field(default=None, alias="reviewDueAt")


class _RequestRow(BaseModel):
    model_config = ConfigDict(extra="ignore", populate_by_name=True)

    site_id: str = Field(alias="siteId")
    host: str
    scheme: str = "https"
    path: str
    method: str = "GET"
    fetch_mode: str = Field(default="http", alias="fetchMode")
    purpose: str
    requests_per_second: float = Field(alias="requestsPerSecond")


def aware(value: datetime | None) -> datetime | None:
    return value if value is None or value.tzinfo else value.replace(tzinfo=UTC)


def _decode(value: str | object, label: str, problems: list[str]) -> object:
    if not isinstance(value, str):
        return value
    try:
        return json.loads(value)
    except json.JSONDecodeError:
        problems.append(f"{label} is not valid JSON")
        return None


def _scope(raw: object, problems: list[str]) -> ApprovedScope | None:
    decoded = _decode(raw, "approved scope", problems) if raw is not None else None
    try:
        return _SCOPE.validate_python(decoded) if decoded is not None else None
    except ValidationError:
        problems.append("approved scope is malformed")
        return None


def _conditions(raw: object, problems: list[str]) -> tuple[Condition, ...]:
    decoded = _decode(raw, "conditions", problems) if raw is not None else None
    if decoded is None:
        return ()
    found: list[Condition] = []
    for entry in _CONDITION_LIST.validate_python(decoded):
        kind = str(entry.get("type"))
        adapter = _CONDITION_TYPES.get(kind)
        found.append(adapter.validate_python(entry) if adapter else UnenforceableCondition(type=kind))
    return tuple(found)


def _categories(raw: object, problems: list[str]) -> tuple[str, ...]:
    decoded = _decode(raw, "personal data categories", problems) if raw is not None else None
    return _STRINGS.validate_python(decoded) if decoded is not None else ()


def parse_assessment(row: dict[str, object] | None) -> ParsedAssessment:
    """A database assessment row (or None) becomes a typed Assessment plus the problems found reading it."""
    if row is None:
        return ParsedAssessment(assessment=None)
    try:
        data = _Row.model_validate(row)
    except ValidationError as problem:
        return ParsedAssessment(
            assessment=None, problems=(f"the assessment is unreadable: {problem.error_count()} errors",)
        )
    problems: list[str] = []
    assessment = Assessment(
        id=data.id,
        status=data.status,
        jurisdiction_id=data.jurisdiction_id,
        personal_data_categories=_categories(data.personal_data_categories, problems),
        lawful_basis=data.lawful_basis,
        approved_scope=_scope(data.approved_scope, problems),
        conditions=_conditions(data.conditions, problems),
        reviewed_by=data.reviewed_by,
        reviewed_at=aware(data.reviewed_at),
        review_due_at=aware(data.review_due_at),
    )
    return ParsedAssessment(assessment=assessment, problems=tuple(problems))


def parse_request(row: dict[str, object]) -> GateRequest:
    """A gate request payload (camelCase) becomes the typed GateRequest shared with the fetcher."""
    data = _RequestRow.model_validate(row)
    return GateRequest(
        site_id=data.site_id,
        host=data.host,
        scheme=data.scheme,
        path=data.path,
        method=data.method,
        fetch_mode=FetchMode(data.fetch_mode),
        purpose=Purpose(data.purpose),
        requests_per_second=data.requests_per_second,
    )
