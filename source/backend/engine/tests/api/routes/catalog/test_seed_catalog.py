"""Contract test: the Seed Catalog router serves exactly the contract's methods, paths and statuses."""

from __future__ import annotations

from unittest.mock import create_autospec

from fastapi.routing import APIRoute

from mzizi_engine.api.routes.catalog.seed_catalog import CatalogSeedCatalogService, build_catalog_seed_catalog_router


def test_routes_match_contract() -> None:
    router = build_catalog_seed_catalog_router(create_autospec(CatalogSeedCatalogService, instance=True))
    served = {
        (method, route.path, route.status_code)
        for route in router.routes
        if isinstance(route, APIRoute)
        for method in route.methods
    }
    assert served == {
        ("GET", "/v1/catalog/seed-tables", 200),
    }
