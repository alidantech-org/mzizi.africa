"""Contract test: Package Health keeps the fields, aliases and required flags its contract declares."""

from __future__ import annotations

from mzizi_engine.api.schemas.api.system.models.package_health import PackageHealth


def test_fields_match_contract() -> None:
    fields = PackageHealth.model_fields
    assert {name: field.alias for name, field in fields.items()} == {
        "exposure": "exposure",
        "in_flight": "inFlight",
        "max_concurrency": "maxConcurrency",
        "name": "name",
    }


def test_required_fields_match_contract() -> None:
    required = {name for name, field in PackageHealth.model_fields.items() if field.is_required()}
    assert required == set(
        [
            "exposure",
            "in_flight",
            "max_concurrency",
            "name",
        ]
    )
