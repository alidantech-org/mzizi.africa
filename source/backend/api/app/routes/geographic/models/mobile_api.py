"""Typed response contracts for the mobile geography API."""

from datetime import date, datetime
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field

Position = tuple[float, ...]
LinearRing = list[Position]
PolygonCoordinates = list[LinearRing]
MultiPolygonCoordinates = list[PolygonCoordinates]


class PolygonGeometry(BaseModel):
    type: Literal["Polygon"]
    coordinates: PolygonCoordinates


class MultiPolygonGeometry(BaseModel):
    type: Literal["MultiPolygon"]
    coordinates: MultiPolygonCoordinates


Geometry = Annotated[PolygonGeometry | MultiPolygonGeometry, Field(discriminator="type")]


class BoundaryFeatureProperties(BaseModel):
    model_config = ConfigDict(extra="allow")
    geography_id: str
    name: str
    display_name: str
    level: str
    boundary_verified: bool
    boundary_source: str
    boundary_source_reference: str
    boundary_license: str
    boundary_year: str | None = None
    boundary_retrieved_at: datetime | None = None
    valid_from: date | None = None
    valid_to: date | None = None
    boundary_version: int
    label_point: Position | None = None


class GeographyFeature(BaseModel):
    type: Literal["Feature"] = "Feature"
    properties: BoundaryFeatureProperties
    geometry: Geometry


class GeographyFeatureCollection(BaseModel):
    type: Literal["FeatureCollection"] = "FeatureCollection"
    features: list[GeographyFeature] = Field(default_factory=list)


class GeographyAncestor(BaseModel):
    id: str
    name: str
    display_name: str
    level: str


class GeographyHistoricalName(BaseModel):
    name: str
    valid_from: date | None = None
    valid_to: date | None = None
    source_reference: str


class GeographyHistoricalRelationship(BaseModel):
    related_entity_id: str
    relation_type: Literal["renamed_to", "split_into", "merged_into", "continued_as"]
    valid_from: date
    valid_to: date | None = None
    source_reference: str | None = None


class GeographyEntityResponse(BaseModel):
    id: str
    name: str
    display_name: str
    level: str
    parent_id: str | None = None
    parent_name: str | None = None
    ancestors: list[GeographyAncestor] = Field(default_factory=list)
    boundary_verified: bool = False
    boundary_source: str | None = None
    boundary_source_reference: str | None = None
    boundary_license: str | None = None
    boundary_year: str | None = None
    boundary_retrieved_at: datetime | None = None
    valid_from: date | None = None
    valid_to: date | None = None
    boundary_version: int | None = None
    historical_names: list[GeographyHistoricalName] = Field(default_factory=list)
    historical_relationships: list[GeographyHistoricalRelationship] = Field(default_factory=list)


class GeographySearchResponse(BaseModel):
    results: list[GeographyEntityResponse] = Field(default_factory=list)


class GovernanceRecord(BaseModel):
    title: str
    summary: str | None = None


class GovernanceSection(BaseModel):
    title: str
    records: list[GovernanceRecord] = Field(default_factory=list)


class GeographyGovernanceResponse(BaseModel):
    sections: list[GovernanceSection] = Field(default_factory=list)


class GeographyMapContextResponse(BaseModel):
    parent_boundary: GeographyFeature | None = None
    sibling_boundaries: GeographyFeatureCollection = Field(default_factory=GeographyFeatureCollection)
