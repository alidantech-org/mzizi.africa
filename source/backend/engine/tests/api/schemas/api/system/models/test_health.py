"""Contract test: Health keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.system.models.health import Health


def test_fields_match_contract() -> None:
    fields = Health.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "active_jobs": "activeJobs",
        "auth": "auth",
        "capabilities": "capabilities",
        "packages": "packages",
        "runtime": "runtime",
        "service": "service",
        "status": "status",
        "store": "store",
        "version": "version",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in Health.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "active_jobs",
            "auth",
            "capabilities",
            "packages",
            "runtime",
            "service",
            "status",
            "store",
            "version",
        ]
    )
