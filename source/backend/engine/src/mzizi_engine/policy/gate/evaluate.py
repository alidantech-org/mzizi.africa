"""Collection gate decision (pure function), tested against seed/_fixtures/contracts/gate-vectors.json.

The engine loads and parses the assessment; this module holds only the rule. It fails closed: missing, overdue,
restricted or out-of-scope approvals deny the request. It is independent of structure validity and site health
(LEGALITY_SAFETY_AND_COMPLIANCE.md sections 8 and 9.3).
"""

from __future__ import annotations

from datetime import datetime

from mzizi_fetch import Decision, GateRequest, Purpose

from .checks import condition_reasons, effective_rate_limit, jurisdiction_reasons, personal_data_reasons, scope_reasons
from .models import APPROVING, ASSESSABLE, Assessment, LegalStatus, ParsedAssessment

ASSESSMENT_RATE = 0.5
SAFE_METHODS = ("GET", "HEAD")


def _deny(assessment_id: str | None, *reasons: str) -> Decision:
    return Decision(allowed=False, reasons=list(reasons), assessment_id=assessment_id)


def _effective_status(assessment: Assessment | None, now: datetime) -> tuple[LegalStatus, bool]:
    """The status in force, and whether an approval has gone past its review date."""
    status = assessment.status if assessment else LegalStatus.NOT_REVIEWED
    due = assessment.review_due_at if assessment else None
    overdue = due is not None and due < now
    return (LegalStatus.EXPIRED if overdue and status in APPROVING else status), overdue


def _assess(effective: LegalStatus, request: GateRequest, assessment_id: str | None) -> Decision:
    """A bounded, read-only contact to assess a source."""
    if effective not in ASSESSABLE:
        return _deny(assessment_id, f"status {effective.value} does not permit contact with the source")
    if request.method.upper() not in SAFE_METHODS:
        return _deny(assessment_id, "assessment requests are limited to GET and HEAD")
    rate = min(request.requests_per_second or ASSESSMENT_RATE, ASSESSMENT_RATE)
    return Decision(
        allowed=True,
        reasons=[f"bounded assessment under status {effective.value}"],
        assessment_id=assessment_id,
        requests_per_second=rate,
    )


def evaluate(parsed: ParsedAssessment, stage: str | None, request: GateRequest, now: datetime) -> Decision:
    assessment = parsed.assessment
    aid = assessment.id if assessment else None
    effective, overdue = _effective_status(assessment, now)

    if request.purpose is Purpose.ASSESS:
        return _assess(effective, request, aid)
    if effective not in APPROVING:
        reason = "the assessment review is overdue" if effective is LegalStatus.EXPIRED and overdue else None
        return _deny(aid, reason or f"legal status is {effective.value}", *parsed.problems)
    if assessment is None:
        return _deny(aid, "no assessment")
    if not assessment.reviewed_by or not assessment.reviewed_at:
        return _deny(
            aid, "an approval must name an accountable approving account (a person or an AI agent) and a review date"
        )
    scope = assessment.approved_scope
    if scope is None or not scope.hosts:
        return _deny(aid, *parsed.problems, "approved scope lists no hosts")

    reasons = [*parsed.problems, *jurisdiction_reasons(assessment, stage), *personal_data_reasons(assessment)]
    reasons.extend(scope_reasons(scope, request))
    if effective is LegalStatus.APPROVED_WITH_CONDITIONS and not assessment.conditions:
        reasons.append("approved with conditions but none are recorded")
    reasons.extend(condition_reasons(assessment.conditions, request))
    limit = effective_rate_limit(scope, assessment.conditions)
    if limit is not None and request.requests_per_second > limit:
        reasons.append(f"requested rate {request.requests_per_second}/s exceeds the limit of {limit}/s")
    if reasons:
        return _deny(aid, *reasons)
    return Decision(allowed=True, assessment_id=aid, requests_per_second=limit)
