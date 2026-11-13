"""Individual gate checks. Each returns the denial reasons it found; none of them decides alone."""

from __future__ import annotations

from mzizi_fetch import GateRequest, Purpose

from .models import (
    NO_PERSONAL_DATA,
    PILOT_OR_PRODUCTION,
    ApprovedScope,
    Assessment,
    Condition,
    ExcludedPaths,
    MaxRequestsPerSecond,
    NoPublish,
    UnenforceableCondition,
)


def starts_with_any(path: str, prefixes: tuple[str, ...]) -> bool:
    return any(path.startswith(prefix) for prefix in prefixes)


def jurisdiction_reasons(assessment: Assessment, stage: str | None) -> list[str]:
    if not assessment.jurisdiction_id:
        return ["the assessment names no jurisdiction"]
    if stage not in PILOT_OR_PRODUCTION:
        return [f"the jurisdiction dossier is at stage {stage or 'missing'}, not pilot or production"]
    return []


def personal_data_reasons(assessment: Assessment) -> list[str]:
    expected = any(c != NO_PERSONAL_DATA for c in assessment.personal_data_categories)
    if expected and not assessment.lawful_basis:
        return ["personal data is expected but no lawful basis is recorded"]
    return []


def scope_reasons(scope: ApprovedScope, request: GateRequest) -> list[str]:
    reasons: list[str] = []
    if request.host not in scope.hosts:
        reasons.append(f"host {request.host} is outside the approved scope")
    if request.scheme not in scope.schemes:
        reasons.append(f"scheme {request.scheme} is outside the approved scope")
    if scope.paths.deny and starts_with_any(request.path, scope.paths.deny):
        reasons.append(f"path {request.path} is denied")
    if scope.paths.allow and not starts_with_any(request.path, scope.paths.allow):
        reasons.append(f"path {request.path} is not in the allowed paths")
    if request.fetch_mode not in scope.fetch_modes:
        reasons.append(f"fetch mode {request.fetch_mode.value} is outside the approved scope")
    if scope.purposes and request.purpose is Purpose.PUBLISH and Purpose.PUBLISH not in scope.purposes:
        reasons.append("publication is outside the approved purposes")
    return reasons


def condition_reasons(conditions: tuple[Condition, ...], request: GateRequest) -> list[str]:
    reasons: list[str] = []
    for condition in conditions:
        if isinstance(condition, UnenforceableCondition):
            reasons.append(f"condition {condition.type} cannot be enforced by the engine")
        elif isinstance(condition, NoPublish) and request.purpose is Purpose.PUBLISH:
            reasons.append("a condition forbids publication")
        elif isinstance(condition, ExcludedPaths) and starts_with_any(request.path, condition.value):
            reasons.append(f"path {request.path} is excluded by a condition")
    return reasons


def effective_rate_limit(scope: ApprovedScope, conditions: tuple[Condition, ...]) -> float | None:
    """The most conservative rate among the approved scope and every rate condition."""
    limits = [scope.max_requests_per_second] if scope.max_requests_per_second is not None else []
    limits.extend(c.value for c in conditions if isinstance(c, MaxRequestsPerSecond))
    return min(limits) if limits else None
