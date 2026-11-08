"""
Geographic Service - Business logic for geographic operations
"""

import logging
from typing import Dict, Any, List
from sqlalchemy.orm import Session

from .geographic_interface import GeographicInterface
from .repositories.geo_levels_repository import GeoLevelsRepository
from .repositories.geo_units_repository import GeoUnitsRepository
from .helpers.geographic_query_builder import GeographicQueryBuilder
from .helpers.response_builders import GeographicResponseBuilder


logger = logging.getLogger(__name__)


class GeoService(GeographicInterface):
    """Service class for geographic operations"""

    def __init__(self, db: Session):
        self.db = db
        self.geo_levels_repo = GeoLevelsRepository(db)
        self.geo_units_repo = GeoUnitsRepository(db)
        self.query_builder = GeographicQueryBuilder()
        self.response_builder = GeographicResponseBuilder()

    async def get_geo_levels(self, query: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Get geographic levels with filtering"""
        try:
            # Execute search directly with query
            result = await self.geo_levels_repo.search(query)

            logger.info(f"Retrieved {len(result)} geo levels")
            return result

        except Exception as e:
            logger.error(f"Error getting geo levels: {str(e)}")
            raise

    async def get_geo_units(self, query: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Get geographic units with filtering"""
        try:
            # Execute search directly with query
            result = await self.geo_units_repo.search(query)

            logger.info(f"Retrieved {len(result)} geo units")
            return result

        except Exception as e:
            logger.error(f"Error getting geo units: {str(e)}")
            raise

    async def get_geo_level_analytics(
        self, query: Dict[str, Any]
    ) -> Dict[str, Any] | List[Dict[str, Any]]:
        """Get analytics for geographic levels"""
        try:
            # Execute analytics directly with query
            result = await self.geo_levels_repo.analytics(query)

            logger.info(f"Retrieved geo levels analytics")
            return result

        except Exception as e:
            logger.error(f"Error getting geo levels analytics: {str(e)}")
            raise

    async def get_geo_unit_analytics(
        self, query: Dict[str, Any]
    ) -> Dict[str, Any] | List[Dict[str, Any]]:
        """Get analytics for geographic units"""
        try:
            # Execute analytics directly with query
            result = await self.geo_units_repo.analytics(query)

            logger.info(f"Retrieved geo units analytics")
            return result

        except Exception as e:
            logger.error(f"Error getting geo units analytics: {str(e)}")
            raise

    async def get_geo_hierarchy(self, query: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Get hierarchical tree for a geographic unit"""
        try:
            # Execute hierarchy search directly with query
            result = await self.geo_units_repo.search(query)

            # Build hierarchy tree
            geo_unit_code = query.get("geo_unit_code")
            hierarchy = self.response_builder.build_hierarchy_tree(
                result, geo_unit_code
            )

            logger.info(f"Retrieved hierarchy for {geo_unit_code}")
            return hierarchy

        except Exception as e:
            logger.error(f"Error getting geo hierarchy: {str(e)}")
            raise

    async def search_geographic_data(self, query: Dict[str, Any]) -> Dict[str, Any]:
        """Search across all geographic data"""
        try:
            # Determine search scope
            search_scope = query.get("scope", "all")

            results = {}

            if search_scope in ["all", "levels"]:
                # Search geo levels
                levels_result = await self.geo_levels_repo.search(query)
                results["geo_levels"] = levels_result

            if search_scope in ["all", "units"]:
                # Search geo units
                units_result = await self.geo_units_repo.search(query)
                results["geo_units"] = units_result

            # Add analytics if requested
            if query.get("include_analytics", False):
                analytics = {}

                if search_scope in ["all", "levels"]:
                    levels_analytics = await self.geo_levels_repo.analytics(query)
                    analytics["geo_levels"] = levels_analytics

                if search_scope in ["all", "units"]:
                    units_analytics = await self.geo_units_repo.analytics(query)
                    analytics["geo_units"] = units_analytics

                results["analytics"] = analytics

            logger.info(
                f"Retrieved geographic search results for scope: {search_scope}"
            )
            return results

        except Exception as e:
            logger.error(f"Error searching geographic data: {str(e)}")
            raise
