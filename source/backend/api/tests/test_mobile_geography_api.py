"""Contract and route-registration tests for the mobile geography API."""

import os

# Keep importing the existing DB dependency safe for route-only tests.
for key, value in {
    "DATABASE_URL": "sqlite:///:memory:",
    "REDIS_URL": "redis://localhost:6379/0",
    "S3_ENDPOINT": "http://localhost:9000",
    "S3_ACCESS_KEY": "test",
    "S3_SECRET_KEY": "test",
    "S3_FILES_BUCKET": "test",
    "S3_PUBLIC_URL_BASE": "http://localhost:9000/test",
    "SECRET_KEY": "test-only",
}.items():
    os.environ[key] = value

from fastapi import FastAPI, HTTPException
from fastapi.testclient import TestClient

from app.routes.api_router import api_v1_router
from app.routes.geographic.geographic_controller import (
    get_mobile_geography_service,
    mobile_router,
)
from app.routes.geographic.mobile_geography_service import MobileGeographyService
from app.routes.geographic.models.mobile_api import (
    BoundaryFeatureProperties,
    GeographyAncestor,
    GeographyEntityResponse,
    GeographyFeature,
    GeographyFeatureCollection,
    GeographyGovernanceResponse,
    GeographyMapContextResponse,
    GeographySearchResponse,
    GovernanceRecord,
    GovernanceSection,
)


def sample_feature(entity_id: str = "geo-county") -> GeographyFeature:
    return GeographyFeature(
        properties=BoundaryFeatureProperties(
            geography_id=entity_id,
            name="Sample County",
            display_name="Sample County",
            level="county",
            boundary_verified=True,
            boundary_source="Test source",
            boundary_source_reference="test://source-artifact",
            boundary_license="CC BY 4.0",
            boundary_version=1,
            label_point=(36.8, -1.2),
        ),
        geometry={
            "type": "MultiPolygon",
            "coordinates": [[
                [[36.0, -2.0], [37.0, -2.0], [37.0, -1.0], [36.0, -2.0]],
                [[36.2, -1.8], [36.4, -1.8], [36.4, -1.6], [36.2, -1.8]],
            ]],
        },
    )


class FakeGeographyService:
    def search(self, q: str, country: str | None, level: str | None, limit: int):
        return GeographySearchResponse(results=[GeographyEntityResponse(
            id="geo-county", name=q, display_name=q, level=level or "county",
            parent_id="geo-country", parent_name="Exampleland",
            ancestors=[GeographyAncestor(id="geo-country", name="Exampleland", display_name="Exampleland", level="country")],
            boundary_verified=True,
        )][:limit])

    def country_boundaries(self, country: str, level: str):
        return GeographyFeatureCollection(features=[sample_feature()])

    def entity_by_id(self, entity_id: str):
        if entity_id == "missing":
            raise HTTPException(status_code=404, detail="Geography entity not found")
        return GeographyEntityResponse(id=entity_id, name="Sample", display_name="Sample", level="county")

    def boundary(self, entity_id: str):
        return sample_feature(entity_id)

    def child_boundaries(self, entity_id: str):
        return GeographyFeatureCollection(features=[])

    def map_context(self, entity_id: str):
        return GeographyMapContextResponse(sibling_boundaries=GeographyFeatureCollection(features=[]))

    def governance(self, entity_id: str):
        if entity_id == "missing-governance":
            raise HTTPException(status_code=404, detail="No governance records")
        return GeographyGovernanceResponse(sections=[GovernanceSection(
            title="Current offices", records=[GovernanceRecord(title="Governor", summary="Sourced holder")]
        )])


def make_client() -> TestClient:
    app = FastAPI()
    app.include_router(mobile_router, prefix="/v1/geography")
    app.dependency_overrides[get_mobile_geography_service] = lambda: FakeGeographyService()  # type: ignore[assignment]
    return TestClient(app)


def test_all_contract_routes_are_registered_and_respond() -> None:
    registered_paths = {route.path for route in api_v1_router.routes}
    contract_paths = {
        "/v1/geography/search",
        "/v1/geography/boundaries",
        "/v1/geography/entities/{entity_id}",
        "/v1/geography/entities/{entity_id}/boundary",
        "/v1/geography/entities/{entity_id}/children/boundaries",
        "/v1/geography/entities/{entity_id}/map-context",
        "/v1/geography/entities/{entity_id}/governance",
    }
    assert contract_paths <= registered_paths
    client = make_client()
    assert client.get("/v1/geography/search", params={"q": "Sample", "country": "KE", "limit": 12}).status_code == 200
    assert client.get("/v1/geography/boundaries", params={"country": "KE", "level": "county"}).json()["features"][0]["properties"]["boundary_verified"] is True
    assert client.get("/v1/geography/entities/geo-county").status_code == 200
    assert client.get("/v1/geography/entities/geo-county/boundary").json()["properties"]["geography_id"] == "geo-county"
    assert client.get("/v1/geography/entities/geo-county/children/boundaries").json()["features"] == []
    assert client.get("/v1/geography/entities/geo-county/map-context").status_code == 200
    assert client.get("/v1/geography/entities/geo-county/governance").json()["sections"][0]["records"][0]["title"] == "Governor"


def test_entity_and_optional_governance_missing_resources_return_404() -> None:
    client = make_client()
    assert client.get("/v1/geography/entities/missing").status_code == 404
    assert client.get("/v1/geography/entities/missing-governance/governance").status_code == 404


def test_geometry_validation_accepts_holes_and_rejects_open_or_out_of_range_rings() -> None:
    valid = sample_feature().geometry
    assert MobileGeographyService._valid_geometry(valid)
    assert not MobileGeographyService._valid_geometry({"type": "Polygon", "coordinates": [[[0, 0], [1, 0], [1, 1], [0, 1]]]})
    assert not MobileGeographyService._valid_geometry({"type": "Polygon", "coordinates": [[[0, 0], [200, 0], [1, 1], [0, 0]]]})
