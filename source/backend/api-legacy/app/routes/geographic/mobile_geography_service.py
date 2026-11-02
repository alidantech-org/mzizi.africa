"""Read-only service for the contract used by the Flutter geography map."""

from datetime import date
from typing import Any

from fastapi import HTTPException
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from .models.geo_boundary_versions import GeoBoundaryVersions
from .models.geo_levels import GeoLevels
from .models.geo_units import GeoUnits
from .models.geo_unit_name_versions import GeoUnitNameVersions
from .models.geo_unit_change_relationships import GeoUnitChangeRelationships
from .models.mobile_api import (
    BoundaryFeatureProperties,
    GeographyAncestor,
    GeographyEntityResponse,
    GeographyFeature,
    GeographyFeatureCollection,
    GeographyHistoricalName,
    GeographyHistoricalRelationship,
    GeographyGovernanceResponse,
    GeographyMapContextResponse,
    GeographySearchResponse,
    GovernanceRecord,
    GovernanceSection,
)


class MobileGeographyService:
    def __init__(self, db: Session):
        self.db = db

    def search(self, q: str, country: str | None, level: str | None, limit: int) -> GeographySearchResponse:
        statement = (
            select(GeoUnits)
            .join(GeoLevels, GeoLevels.id == GeoUnits.geo_level_id, isouter=True)
            .where(
                GeoUnits.is_active.is_(True),
                or_(GeoUnits.name.ilike(f"%{q.strip()}%"), GeoUnits.geo_unit_code.ilike(f"%{q.strip()}%")),
            )
            .order_by(GeoUnits.name, GeoUnits.id)
        )
        if level:
            statement = statement.where(
                or_(func.lower(GeoUnits.geo_level_code) == level.lower(), func.lower(GeoLevels.level_name) == level.lower())
            )
        if country:
            country_root = country.casefold()
            statement = statement.where(
                or_(
                    func.lower(GeoUnits.geo_unit_code) == country_root,
                    func.lower(GeoUnits.geo_unit_code).like(f"{country_root}/%"),
                )
            )
        candidates = self.db.execute(statement.limit(limit)).scalars().unique().all()
        results = []
        for unit in candidates:
            if country and self._country_code(unit).casefold() != country.casefold():
                continue
            results.append(self.entity(unit))
            if len(results) == limit:
                break
        return GeographySearchResponse(results=results)

    def entity_by_id(self, entity_id: str) -> GeographyEntityResponse:
        unit = self.db.get(GeoUnits, entity_id)
        if unit is None or not unit.is_active:
            raise HTTPException(status_code=404, detail="Geography entity not found")
        return self.entity(unit)

    def entity(self, unit: GeoUnits) -> GeographyEntityResponse:
        parent = self.db.get(GeoUnits, unit.parent_geo_unit_id) if unit.parent_geo_unit_id else None
        ancestors: list[GeographyAncestor] = []
        current = parent
        seen = {unit.id}
        while current is not None and current.id not in seen:
            seen.add(current.id)
            ancestors.append(self._ancestor(current))
            current = self.db.get(GeoUnits, current.parent_geo_unit_id) if current.parent_geo_unit_id else None
        ancestors.reverse()
        boundary = self._boundary(unit.id)
        name_versions = self.db.execute(
            select(GeoUnitNameVersions)
            .where(GeoUnitNameVersions.geo_unit_id == unit.id)
            .order_by(GeoUnitNameVersions.valid_from, GeoUnitNameVersions.name)
        ).scalars().all()
        relations = self.db.execute(
            select(GeoUnitChangeRelationships).where(
                or_(GeoUnitChangeRelationships.source_geo_unit_id == unit.id, GeoUnitChangeRelationships.target_geo_unit_id == unit.id),
            ).order_by(GeoUnitChangeRelationships.valid_from)
        ).scalars().all()
        historical_relationships = []
        for relation in relations:
            related_id = relation.target_geo_unit_id if relation.source_geo_unit_id == unit.id else relation.source_geo_unit_id
            if related_id:
                historical_relationships.append(GeographyHistoricalRelationship(
                    related_entity_id=related_id,
                    relation_type=relation.relation_type,
                    valid_from=relation.valid_from,
                    valid_to=relation.valid_to,
                    source_reference=relation.source_reference,
                ))
        return GeographyEntityResponse(
            id=unit.id,
            name=unit.name,
            display_name=unit.name,
            level=self._level_name(unit),
            parent_id=parent.id if parent else None,
            parent_name=parent.name if parent else None,
            ancestors=ancestors,
            boundary_verified=boundary is not None,
            boundary_source=boundary.source_name if boundary else None,
            boundary_source_reference=boundary.source_reference if boundary else None,
            boundary_license=boundary.license if boundary else None,
            boundary_year=boundary.reference_year if boundary else None,
            boundary_retrieved_at=boundary.retrieved_at if boundary else None,
            valid_from=boundary.valid_from if boundary else None,
            valid_to=boundary.valid_to if boundary else None,
            boundary_version=boundary.version_number if boundary else None,
            historical_names=[GeographyHistoricalName(
                name=version.name,
                valid_from=version.valid_from,
                valid_to=version.valid_to,
                source_reference=version.source_reference,
            ) for version in name_versions],
            historical_relationships=historical_relationships,
        )

    def country_boundaries(self, country: str, level: str) -> GeographyFeatureCollection:
        country_root = country.casefold()
        statement = (
            select(GeoUnits)
            .join(GeoLevels, GeoLevels.id == GeoUnits.geo_level_id, isouter=True)
            .where(
                GeoUnits.is_active.is_(True),
                or_(func.lower(GeoUnits.geo_level_code) == level.lower(), func.lower(GeoLevels.level_name) == level.lower()),
                or_(
                    func.lower(GeoUnits.geo_unit_code) == country_root,
                    func.lower(GeoUnits.geo_unit_code).like(f"{country_root}/%"),
                ),
            )
            .order_by(GeoUnits.name, GeoUnits.id)
        )
        features = []
        for unit in self.db.execute(statement).scalars().unique():
            if self._country_code(unit).casefold() != country.casefold():
                continue
            boundary = self._boundary(unit.id)
            if boundary is not None:
                features.append(self.feature(unit, boundary))
        return GeographyFeatureCollection(features=features)

    def boundary(self, entity_id: str) -> GeographyFeature:
        unit = self._active_unit(entity_id)
        boundary = self._boundary(unit.id)
        if boundary is None:
            raise HTTPException(status_code=404, detail="No verified boundary is available for this geography entity")
        return self.feature(unit, boundary)

    def child_boundaries(self, entity_id: str) -> GeographyFeatureCollection:
        parent = self._active_unit(entity_id)
        children = self.db.execute(
            select(GeoUnits).where(
                GeoUnits.parent_geo_unit_id == parent.id,
                GeoUnits.is_active.is_(True),
            ).order_by(GeoUnits.name, GeoUnits.id)
        ).scalars().all()
        features = []
        for child in children:
            boundary = self._boundary(child.id)
            if boundary is not None:
                features.append(self.feature(child, boundary))
        return GeographyFeatureCollection(features=features)

    def map_context(self, entity_id: str) -> GeographyMapContextResponse:
        unit = self._active_unit(entity_id)
        parent = self.db.get(GeoUnits, unit.parent_geo_unit_id) if unit.parent_geo_unit_id else None
        parent_boundary = self._boundary(parent.id) if parent and parent.is_active else None
        siblings = []
        if parent is not None:
            sibling_units = self.db.execute(
                select(GeoUnits).where(
                    GeoUnits.parent_geo_unit_id == parent.id,
                    GeoUnits.id != unit.id,
                    GeoUnits.is_active.is_(True),
                ).order_by(GeoUnits.name, GeoUnits.id)
            ).scalars().all()
            for sibling in sibling_units:
                boundary = self._boundary(sibling.id)
                if boundary is not None:
                    siblings.append(self.feature(sibling, boundary))
        return GeographyMapContextResponse(
            parent_boundary=self.feature(parent, parent_boundary) if parent and parent_boundary else None,
            sibling_boundaries=GeographyFeatureCollection(features=siblings),
        )

    def governance(self, entity_id: str) -> GeographyGovernanceResponse:
        unit = self._active_unit(entity_id)
        # This endpoint exposes only linked, current office-holder rows already
        # in the canonical political/governance tables.
        from app.routes.offices.models.holders import Holders
        from app.routes.offices.models.offices import Offices
        from app.routes.people.models.people import People

        rows = self.db.execute(
            select(Offices.title, People.full_name)
            .join(Holders, Holders.office_id == Offices.id)
            .join(People, People.id == Holders.person_id)
            .where(
                Holders.geo_unit_id == unit.id,
                Holders.is_active.is_(True),
                Holders.is_current.is_(True),
                People.is_active.is_(True),
            )
            .order_by(Offices.title, People.full_name)
        ).all()
        if not rows:
            raise HTTPException(status_code=404, detail="No governance records are linked to this geography entity")
        return GeographyGovernanceResponse(
            sections=[GovernanceSection(
                title="Current office holders",
                records=[GovernanceRecord(title=title, summary=name) for title, name in rows],
            )]
        )

    def feature(self, unit: GeoUnits, boundary: GeoBoundaryVersions) -> GeographyFeature:
        geometry = boundary.geometry
        if not self._valid_geometry(geometry):
            raise HTTPException(status_code=500, detail="Stored verified geography boundary is malformed")
        label_point = boundary.label_point
        if label_point is not None and (
            not isinstance(label_point, list)
            or len(label_point) < 2
            or not all(isinstance(value, (float, int)) for value in label_point[:2])
            or not -180 <= label_point[0] <= 180
            or not -90 <= label_point[1] <= 90
        ):
            label_point = None
        return GeographyFeature(
            properties=BoundaryFeatureProperties(
                geography_id=unit.id,
                name=unit.name,
                display_name=unit.name,
                level=self._level_name(unit),
                boundary_verified=True,
                boundary_source=boundary.source_name,
                boundary_source_reference=boundary.source_reference,
                boundary_license=boundary.license,
                boundary_year=boundary.reference_year,
                boundary_retrieved_at=boundary.retrieved_at,
                valid_from=boundary.valid_from,
                valid_to=boundary.valid_to,
                boundary_version=boundary.version_number,
                label_point=label_point,
            ),
            geometry=geometry,
        )

    def _active_unit(self, entity_id: str) -> GeoUnits:
        unit = self.db.get(GeoUnits, entity_id)
        if unit is None or not unit.is_active:
            raise HTTPException(status_code=404, detail="Geography entity not found")
        return unit

    def _boundary(self, entity_id: str) -> GeoBoundaryVersions | None:
        return self.db.execute(
            select(GeoBoundaryVersions)
            .where(
                GeoBoundaryVersions.geo_unit_id == entity_id,
                GeoBoundaryVersions.is_current.is_(True),
                GeoBoundaryVersions.is_verified.is_(True),
                or_(GeoBoundaryVersions.valid_from.is_(None), GeoBoundaryVersions.valid_from <= date.today()),
                or_(GeoBoundaryVersions.valid_to.is_(None), GeoBoundaryVersions.valid_to >= date.today()),
            )
            .order_by(GeoBoundaryVersions.version_number.desc())
            .limit(1)
        ).scalar_one_or_none()

    def _level_name(self, unit: GeoUnits) -> str:
        level = self.db.get(GeoLevels, unit.geo_level_id) if unit.geo_level_id else None
        return level.level_name if level else unit.geo_level_code

    def _ancestor(self, unit: GeoUnits) -> GeographyAncestor:
        return GeographyAncestor(id=unit.id, name=unit.name, display_name=unit.name, level=self._level_name(unit))

    def _country_code(self, unit: GeoUnits) -> str:
        current = unit
        seen: set[str] = set()
        while current.parent_geo_unit_id and current.id not in seen:
            seen.add(current.id)
            parent = self.db.get(GeoUnits, current.parent_geo_unit_id)
            if parent is None:
                break
            current = parent
        return current.geo_unit_code.split("/", 1)[0]

    @staticmethod
    def _valid_geometry(geometry: Any) -> bool:
        if not isinstance(geometry, dict) or geometry.get("type") not in {"Polygon", "MultiPolygon"}:
            return False
        coordinates = geometry.get("coordinates")
        if not isinstance(coordinates, list) or not coordinates:
            return False

        def valid_position(position: Any) -> bool:
            return (
                isinstance(position, (list, tuple))
                and len(position) >= 2
                and all(isinstance(value, (int, float)) for value in position[:2])
                and -180 <= position[0] <= 180
                and -90 <= position[1] <= 90
            )

        def valid_ring(ring: Any) -> bool:
            return (
                isinstance(ring, list)
                and len(ring) >= 4
                and all(valid_position(position) for position in ring)
                and list(ring[0]) == list(ring[-1])
            )

        def valid_polygon(polygon: Any) -> bool:
            return isinstance(polygon, list) and bool(polygon) and all(valid_ring(ring) for ring in polygon)

        if geometry["type"] == "Polygon":
            return valid_polygon(coordinates)
        return all(valid_polygon(polygon) for polygon in coordinates)
