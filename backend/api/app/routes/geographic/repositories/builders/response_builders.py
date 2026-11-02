"""
Response Builders - Build responses for geographic operations
"""

from typing import List, Dict, Any, Optional
from app.routes.geographic.models.geo_levels import GeoLevels
from app.routes.geographic.models.geo_units import GeoUnits


class GeoResponseBuilder:
    """Response builder for geographic operations"""

    @staticmethod
    def build_geo_level_list(
        levels: List[GeoLevels], include_details: bool = False
    ) -> List[Dict[str, Any]]:
        """Build response for geographic levels list"""
        response = []

        for level in levels:
            level_data = {
                "id": level.id,
                "geo_level_code": level.geo_level_code,
                "level_name": level.level_name,
                "level_order": level.level_order,
                "is_active": level.is_active,
                "created_at": level.created_at,
                "updated_at": level.updated_at,
            }

            if include_details:
                level_data.update({"description": level.description})

            response.append(level_data)

        return response

    @staticmethod
    def build_geo_unit_list(
        units: List[GeoUnits], include_details: bool = False
    ) -> List[Dict[str, Any]]:
        """Build response for geographic units list"""
        response = []

        for unit in units:
            unit_data = {
                "id": unit.id,
                "geo_unit_code": unit.geo_unit_code,
                "name": unit.name,
                "geo_code": unit.geo_code,
                "geo_level_id": unit.geo_level_id,
                "geo_level_code": unit.geo_level_code,
                "parent_geo_unit_id": unit.parent_geo_unit_id,
                "parent_geo_code": unit.parent_geo_code,
                "is_active": unit.is_active,
                "created_at": unit.created_at,
                "updated_at": unit.updated_at,
            }

            if include_details and unit.geo_level:
                unit_data.update({"geo_level_name": unit.geo_level.level_name})

            response.append(unit_data)

        return response

    @staticmethod
    def build_analytics_response(analytics_type: str, result) -> Dict[str, Any]:
        """Build response for analytics queries"""
        if analytics_type == "summary":
            # Handle case where result is just a count (integer)
            if isinstance(result, int):
                return {"total_count": result}

            # Handle case where result is a result object with attributes
            elif hasattr(result, "total_count"):
                return {
                    "total_count": result.total_count,
                    "min_level_order": getattr(result, "min_level_order", None),
                    "max_level_order": getattr(result, "max_level_order", None),
                    "avg_level_order": (
                        float(getattr(result, "avg_level_order", 0))
                        if getattr(result, "avg_level_order", None)
                        else None
                    ),
                }

            # Handle case where result has distinct counts
            elif hasattr(result, "distinct_levels"):
                return {
                    "total_count": getattr(result, "total_count", 0),
                    "distinct_levels": getattr(result, "distinct_levels", 0),
                    "distinct_parents": getattr(result, "distinct_parents", 0),
                    "distinct_versions": getattr(result, "distinct_versions", 0),
                }

        elif analytics_type == "level_stats":
            if hasattr(result, "__iter__"):
                return [
                    {
                        "level_order": (
                            getattr(row, "level_order", None)
                            if hasattr(row, "level_order")
                            else None
                        ),
                        "level_name": getattr(row, "level_name", None),
                        "geo_level_code": getattr(row, "geo_level_code", None),
                        "count": row.count,
                        "level_names": (
                            row.level_names.split(", ")
                            if hasattr(row, "level_names") and row.level_names
                            else []
                        ),
                    }
                    for row in result
                ]
            else:
                return []

        elif analytics_type == "version_stats":
            if hasattr(result, "__iter__"):
                return [
                    {
                        "count": row.count,
                        "earliest_created": getattr(row, "earliest_created", None),
                        "latest_created": getattr(row, "latest_created", None),
                    }
                    for row in result
                ]
            else:
                return []

        elif analytics_type == "parent_child_stats":
            return {
                "root_units": getattr(result, "root_units", 0),
                "child_units": getattr(result, "child_units", 0),
                "parent_units_with_children": getattr(
                    result, "parent_units_with_children", 0
                ),
            }

        # Default response
        return {"count": result if hasattr(result, "__len__") else 0}

    @staticmethod
    def build_single_geo_level(
        level: Optional[GeoLevels], include_details: bool = False
    ) -> Optional[Dict[str, Any]]:
        """Build response for single geographic level"""
        if not level:
            return None

        level_data = {
            "id": level.id,
            "geo_level_code": level.geo_level_code,
            "level_name": level.level_name,
            "level_order": level.level_order,
            "is_active": level.is_active,
            "created_at": level.created_at,
            "updated_at": level.updated_at,
        }

        if include_details:
            level_data.update({"description": level.description})

        return level_data

    @staticmethod
    def build_single_geo_unit(
        unit: Optional[GeoUnits], include_details: bool = False
    ) -> Optional[Dict[str, Any]]:
        """Build response for single geographic unit"""
        if not unit:
            return None

        unit_data = {
            "id": unit.id,
            "geo_unit_code": unit.geo_unit_code,
            "name": unit.name,
            "geo_code": unit.geo_code,
            "geo_level_id": unit.geo_level_id,
            "geo_level_code": unit.geo_level_code,
            "parent_geo_unit_id": unit.parent_geo_unit_id,
            "parent_geo_code": unit.parent_geo_code,
            "is_active": unit.is_active,
            "created_at": unit.created_at,
            "updated_at": unit.updated_at,
        }

        if include_details and unit.geo_level:
            unit_data.update({"geo_level_name": unit.geo_level.level_name})

        return unit_data
