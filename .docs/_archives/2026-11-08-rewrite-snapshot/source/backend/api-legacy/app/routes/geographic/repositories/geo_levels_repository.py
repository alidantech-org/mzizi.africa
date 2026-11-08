"""
Geo Levels Repository - Database operations for geographic levels
"""

from sqlalchemy.orm import Session
from typing import Dict, Any, List
from app.config.database import get_db
from app.routes.geographic.models.geo_levels import GeoLevels
from .builders.geo_query_builder import GeoQueryBuilder
from .builders.response_builders import GeoResponseBuilder


class GeoLevelsRepository:
    """Repository for geographic levels database operations"""

    def __init__(self, db: Session):
        self.db = db
        self.query_builder = GeoQueryBuilder()

    async def search(self, query: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Search geographic levels with comprehensive filtering"""
        # Set model to GeoLevels
        query["model"] = GeoLevels

        # Flatten filters into main query
        filters = query.get("filters", {})
        query.update(filters)

        # Build query automatically using query builder
        stmt = self.query_builder.build_search_query(query)

        # Execute query
        result = self.db.execute(stmt)
        levels = result.scalars().all()

        # Get response options
        options = query.get("options", {})
        include_details = options.get("include_details", False)

        # Build response using response builder
        return GeoResponseBuilder.build_geo_level_list(levels, include_details)

    async def analytics(
        self, query: Dict[str, Any]
    ) -> Dict[str, Any] | List[Dict[str, Any]]:
        """Get analytics for geographic levels"""
        # Set model to GeoLevels
        query["model"] = GeoLevels

        # Get analytics type
        analytics_type = query.get("analytics_type", "summary")

        # Build analytics query
        stmt = self.query_builder.build_analytics_query(query)

        # Execute query
        result = self.db.execute(stmt)

        if analytics_type == "level_stats":
            analytics_data = result.scalars().all()
        else:
            analytics_data = result.scalar_one_or_none()

        # Build response using response builder
        return GeoResponseBuilder.build_analytics_response(
            analytics_type, analytics_data
        )


# Dependency injection helper
def get_geo_levels_repository() -> GeoLevelsRepository:
    """Get GeoLevels repository instance."""
    db = next(get_db())
    return GeoLevelsRepository(db)
