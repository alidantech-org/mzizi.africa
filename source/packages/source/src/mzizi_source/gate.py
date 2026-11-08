"""Collection gate decision (pure function). Tested against seed/fixtures/contracts/gate-vectors.json.
Loading the assessment from a database is the caller's job (the engine); this package holds only the rule.

Fails closed: missing, overdue, restricted or out-of-scope approvals deny the request. Independent of
structure validity and site health (LEGALITY_SAFETY_AND_COMPLIANCE.md sections 8 and 9.3).
"""
from __future__ import annotations

import json
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any

ENFORCEABLE = {"max_requests_per_second", "no_publish", "attribution_required", "excluded_paths"}
ASSESS_STATUSES = {"not_reviewed", "in_review", "approved", "approved_with_conditions", "expired"}


@dataclass
class Decision:
    allowed: bool
    reasons: list[str] = field(default_factory=list)
    assessment_id: str | None = None
    requests_per_second: float | None = None


def _when(value: Any) -> datetime | None:
    if value is None:
        return None
    if isinstance(value, datetime):
        return value if value.tzinfo else value.replace(tzinfo=timezone.utc)
    return datetime.fromisoformat(str(value).replace("Z", "+00:00"))


def _parse(text: Any, label: str, reasons: list[str]) -> Any:
    if text is None:
        return None
    try:
        return json.loads(text) if isinstance(text, str) else text
    except json.JSONDecodeError:
        reasons.append(f"{label} is not valid JSON")
        return None


def _starts(path: str, prefixes: list[str]) -> bool:
    return any(path.startswith(p) for p in prefixes)


def evaluate(assessment: dict | None, dossier_stage: str | None, request: dict, now: datetime | None = None) -> Decision:
    now = now or _when(request.get("now")) or datetime.now(timezone.utc)
    aid = assessment.get("id") if assessment else None

    def deny(*reasons: str) -> Decision:
        return Decision(False, list(reasons), aid)

    status = assessment["status"] if assessment else "not_reviewed"
    due = _when(assessment.get("reviewDueAt")) if assessment else None
    overdue = due is not None and due < now
    effective = "expired" if overdue and status in ("approved", "approved_with_conditions") else status
    purpose = request["purpose"]

    if purpose == "assess":
        if effective in ASSESS_STATUSES:
            if str(request.get("method", "GET")).upper() not in ("GET", "HEAD"):
                return deny("assessment requests are limited to GET and HEAD")
            return Decision(True, [f"bounded assessment under status {effective}"], aid, min(request.get("requestsPerSecond") or 0.5, 0.5))
        return deny(f"status {effective} does not permit contact with the source")

    if effective not in ("approved", "approved_with_conditions"):
        return deny("the assessment review is overdue" if effective == "expired" and overdue else f"legal status is {effective}")
    if not assessment:
        return deny("no assessment")
    if not assessment.get("reviewedBy") or not assessment.get("reviewedAt"):
        return deny("an approval must name an accountable approving account (a person or an AI agent) and a review date")

    reasons: list[str] = []
    scope = _parse(assessment.get("approvedScope"), "approved scope", reasons)
    if reasons or not isinstance(scope, dict) or not isinstance(scope.get("hosts"), list):
        return deny(*reasons, "approved scope lists no hosts")
    if not assessment.get("jurisdictionId"):
        reasons.append("the assessment names no jurisdiction")
    elif dossier_stage not in ("pilot", "production"):
        reasons.append(f"the jurisdiction dossier is at stage {dossier_stage or 'missing'}, not pilot or production")
    categories = _parse(assessment.get("personalDataCategories"), "personal data categories", reasons) or []
    if any(c != "none_known" for c in categories) and not assessment.get("lawfulBasis"):
        reasons.append("personal data is expected but no lawful basis is recorded")

    scheme, path = request.get("scheme", "https"), request["path"]
    if request["host"] not in scope["hosts"]:
        reasons.append(f"host {request['host']} is outside the approved scope")
    if scheme not in scope.get("schemes", ["https"]):
        reasons.append(f"scheme {scheme} is outside the approved scope")
    paths = scope.get("paths") or {}
    if paths.get("deny") and _starts(path, paths["deny"]):
        reasons.append(f"path {path} is denied")
    if paths.get("allow") and not _starts(path, paths["allow"]):
        reasons.append(f"path {path} is not in the allowed paths")
    if request.get("fetchMode", "http") not in scope.get("fetchModes", ["http", "api"]):
        reasons.append(f"fetch mode {request.get('fetchMode')} is outside the approved scope")
    if scope.get("purposes") and purpose == "publish" and "publish" not in scope["purposes"]:
        reasons.append("publication is outside the approved purposes")

    max_rps = scope.get("maxRequestsPerSecond")
    conditions = _parse(assessment.get("conditions"), "conditions", reasons) or []
    if effective == "approved_with_conditions" and not conditions:
        reasons.append("approved with conditions but none are recorded")
    for condition in conditions:
        ctype = condition.get("type")
        if ctype not in ENFORCEABLE:
            reasons.append(f"condition {ctype} cannot be enforced by the engine")
            continue
        value = condition.get("value")
        if ctype == "max_requests_per_second" and isinstance(value, (int, float)):
            max_rps = value if max_rps is None else min(max_rps, value)
        if ctype == "no_publish" and purpose == "publish":
            reasons.append("a condition forbids publication")
        if ctype == "excluded_paths" and isinstance(value, list) and _starts(path, value):
            reasons.append(f"path {path} is excluded by a condition")
    rps = request.get("requestsPerSecond")
    if max_rps is not None and rps is not None and rps > max_rps:
        reasons.append(f"requested rate {rps}/s exceeds the limit of {max_rps}/s")
    if reasons:
        return deny(*reasons)
    return Decision(True, [], aid, max_rps)
