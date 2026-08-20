"""
Geo Query Builder - Build queries for geographic operations
"""

from sqlalchemy import select, func, and_, or_
from sqlalchemy.orm import joinedload
from sqlalchemy.sql import Select
from typing import Dict, Any
from app.routes.geographic.models.geo_levels import GeoLevels
from app.routes.geographic.models.geo_units import GeoUnits


class GeoQueryBuilder:
    """Query builder for geographic operations"""

    def __init__(self):
        pass

    def build_search_query(self, query: Dict[str, Any]) -> Select:
        """Build search query for geographic levels/units"""
        # Determine model type
        model = query.get("model", GeoLevels)

        # Start with base query
        stmt = select(model)

        # Add filters
        filters = []

        # ID filter
        if query.get("id"):
            filters.append(model.id == query["id"])

        # Code filter
        if query.get("code"):
            filters.append(
                model.geo_level_code == query["code"]
                if hasattr(model, "geo_level_code")
                else model.geo_unit_code == query["code"]
            )

        # Name filter (case-insensitive)
        if query.get("name"):
            filters.append(
                model.level_name.ilike(f'%{query["name"]}%')
                if hasattr(model, "level_name")
                else model.name.ilike(f'%{query["name"]}%')
            )

        # Active filter (for GeoLevels)
        if query.get("is_active") is not None and hasattr(model, "is_active"):
            filters.append(model.is_active == query["is_active"])

        # Level order filter (for GeoLevels)
        if query.get("level_order") is not None and hasattr(model, "level_order"):
            filters.append(model.level_order == query["level_order"])

        # Level code filter (for GeoUnits)
        if query.get("geo_level_code") and hasattr(model, "geo_level_code"):
            filters.append(model.geo_level_code == query["geo_level_code"])

        # Parent unit filter (for GeoUnits)
        if query.get("parent_geo_unit_id") and hasattr(model, "parent_geo_unit_id"):
            filters.append(model.parent_geo_unit_id == query["parent_geo_unit_id"])

        # Parent code filter (for GeoUnits)
        if query.get("parent_geo_code") and hasattr(model, "parent_geo_code"):
            filters.append(model.parent_geo_code == query["parent_geo_code"])

        # Hierarchy range filter (for GeoLevels)
        if (
            query.get("min_level_order")
            and query.get("max_level_order")
            and hasattr(model, "level_order")
        ):
            filters.append(
                and_(
                    model.level_order >= query["min_level_order"],
                    model.level_order <= query["max_level_order"],
                )
            )

        # Search term filter
        if query.get("search_term"):
            search_term = f'%{query["search_term"]}%'
            if hasattr(model, "level_name"):
                search_filter = or_(
                    model.level_name.ilike(search_term),
                    (
                        model.description.ilike(search_term)
                        if hasattr(model, "description")
                        else None
                    ),
                    (
                        model.geo_level_code.ilike(search_term)
                        if hasattr(model, "geo_level_code")
                        else None
                    ),
                )
            else:
                search_filter = or_(
                    model.name.ilike(search_term),
                    (
                        model.geo_unit_code.ilike(search_term)
                        if hasattr(model, "geo_unit_code")
                        else None
                    ),
                    (
                        model.geo_code.ilike(search_term)
                        if hasattr(model, "geo_code")
                        else None
                    ),
                    (
                        model.geo_level_code.ilike(search_term)
                        if hasattr(model, "geo_level_code")
                        else None
                    ),
                    (
                        model.parent_geo_code.ilike(search_term)
                        if hasattr(model, "parent_geo_code")
                        else None
                    ),
                )
            filters.append(search_filter)

        # Apply filters
        if filters:
            stmt = stmt.where(and_(*filters))

        # Add relationships
        if model == GeoUnits:
            stmt = stmt.options(joinedload(GeoUnits.geo_level))

        # Add ordering
        order_by = query.get("order_by")
        if order_by:
            if hasattr(model, order_by):
                stmt = stmt.order_by(getattr(model, order_by))
        else:
            # Default ordering
            if hasattr(model, "level_order"):
                stmt = stmt.order_by(model.level_order)
            elif hasattr(model, "name"):
                stmt = stmt.order_by(model.name)
            elif hasattr(model, "level_name"):
                stmt = stmt.order_by(model.level_name)

        # Add limit
        if query.get("limit"):
            stmt = stmt.limit(query["limit"])

        # Add offset
        if query.get("offset"):
            stmt = stmt.offset(query["offset"])

        return stmt

    def build_count_query(self, query: Dict[str, Any]) -> Select:
        """Build count query for geographic levels/units"""
        # Get search query and convert to count
        search_query = self.build_search_query(query)
        return select(func.count()).select_from(search_query.subquery())

    def build_analytics_query(self, query: Dict[str, Any]) -> Select:
        """Build analytics query for geographic data"""
        analytics_type = query.get("analytics_type", "summary")
        model = query.get("model", GeoLevels)

        if analytics_type == "summary":
            if model == GeoLevels:
                # Build select arguments dynamically to avoid None values
                select_args = [func.count(model.id).label("total_count")]

                if hasattr(model, "level_order"):
                    select_args.extend(
                        [
                            func.min(model.level_order).label("min_level_order"),
                            func.max(model.level_order).label("max_level_order"),
                            func.avg(model.level_order).label("avg_level_order"),
                        ]
                    )

                stmt = select(*select_args)

                # Add filter condition dynamically
                if hasattr(model, "is_active"):
                    stmt = stmt.filter(model.is_active == True)

                return stmt

            elif model == GeoUnits:
                return select(
                    func.count(model.id).label("total_count"),
                    func.count(func.distinct(model.geo_level_id)).label(
                        "distinct_levels"
                    ),
                    func.count(func.distinct(model.parent_geo_unit_id)).label(
                        "distinct_parents"
                    ),
                )

        elif analytics_type == "level_stats":
            if model == GeoLevels:
                return (
                    select(
                        model.level_order,
                        func.count(model.id).label("count"),
                        func.string_agg(model.level_name, ", ").label("level_names"),
                    )
                    .filter(model.is_active == True)
                    .group_by(model.level_order)
                )

            elif model == GeoUnits:
                return (
                    select(
                        GeoLevels.level_name,
                        GeoLevels.geo_level_code,
                        func.count(GeoUnits.id).label("count"),
                    )
                    .join(GeoLevels, GeoUnits.geo_level_id == GeoLevels.id)
                    .group_by(
                        GeoLevels.id, GeoLevels.level_name, GeoLevels.geo_level_code
                    )
                )

        elif analytics_type == "parent_child_stats" and model == GeoUnits:
            return select(
                func.count(func.nullif(model.parent_geo_unit_id.is_(None), True)).label(
                    "root_units"
                ),
                func.count(model.parent_geo_unit_id).label("child_units"),
                func.count(func.distinct(model.parent_geo_unit_id)).label(
                    "parent_units_with_children"
                ),
            )

        # Default to basic count
        return select(func.count(model.id)).filter(
            model.is_active == True if hasattr(model, "is_active") else True
        )
