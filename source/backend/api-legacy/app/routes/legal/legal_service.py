"""
Legal Service - Business logic for legal operations
"""

import logging
from typing import Dict, Any, List
from sqlalchemy.orm import Session

from .legal_interface import LegalInterface
from .repositories.constitutions_repository import ConstitutionsRepository
from .repositories.constitution_sections_repository import ConstitutionSectionsRepository
from .repositories.builders.constitution_query_builder import ConstitutionQueryBuilder
from .repositories.builders.response_builders import LegalResponseBuilder


logger = logging.getLogger(__name__)


class LegalService(LegalInterface):
    """Service class for legal operations"""

    def __init__(self, db: Session):
        self.db = db
        self.constitutions_repo = ConstitutionsRepository(db)
        self.sections_repo = ConstitutionSectionsRepository(db)
        self.query_builder = ConstitutionQueryBuilder()
        self.response_builder = LegalResponseBuilder()

    async def get_constitutions(self, query: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Get constitutions with filtering"""
        try:
            # Execute search directly with query
            result = await self.constitutions_repo.search(query)

            logger.info(f"Retrieved {len(result)} constitutions")
            return result

        except Exception as e:
            logger.error(f"Error getting constitutions: {str(e)}")
            raise

    async def get_constitution_sections(self, query: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Get constitution sections with filtering"""
        try:
            # Execute search directly with query
            result = await self.sections_repo.search(query)

            logger.info(f"Retrieved {len(result)} constitution sections")
            return result

        except Exception as e:
            logger.error(f"Error getting constitution sections: {str(e)}")
            raise

    async def get_constitution_analytics(
        self, query: Dict[str, Any]
    ) -> Dict[str, Any] | List[Dict[str, Any]]:
        """Get analytics for constitutions"""
        try:
            # Execute analytics directly with query
            result = await self.constitutions_repo.analytics(query)

            logger.info(f"Retrieved constitutions analytics")
            return result

        except Exception as e:
            logger.error(f"Error getting constitutions analytics: {str(e)}")
            raise

    async def get_constitution_sections_analytics(
        self, query: Dict[str, Any]
    ) -> Dict[str, Any] | List[Dict[str, Any]]:
        """Get analytics for constitution sections"""
        try:
            # Execute analytics directly with query
            result = await self.sections_repo.analytics(query)

            logger.info(f"Retrieved constitution sections analytics")
            return result

        except Exception as e:
            logger.error(f"Error getting constitution sections analytics: {str(e)}")
            raise

    async def get_constitution_by_id(self, constitution_id: str) -> Dict[str, Any] | None:
        """Get constitution by ID"""
        try:
            result = await self.constitutions_repo.get_by_id(constitution_id)
            logger.info(f"Retrieved constitution by ID: {constitution_id}")
            return result

        except Exception as e:
            logger.error(f"Error getting constitution by ID: {str(e)}")
            raise

    async def get_constitution_by_code(self, constitution_code: str) -> Dict[str, Any] | None:
        """Get constitution by code"""
        try:
            result = await self.constitutions_repo.get_by_code(constitution_code)
            logger.info(f"Retrieved constitution by code: {constitution_code}")
            return result

        except Exception as e:
            logger.error(f"Error getting constitution by code: {str(e)}")
            raise

    async def get_constitution_section_by_id(self, section_id: str) -> Dict[str, Any] | None:
        """Get constitution section by ID"""
        try:
            result = await self.sections_repo.get_by_id(section_id)
            logger.info(f"Retrieved constitution section by ID: {section_id}")
            return result

        except Exception as e:
            logger.error(f"Error getting constitution section by ID: {str(e)}")
            raise

    async def get_constitution_section_by_code(self, section_code: str) -> Dict[str, Any] | None:
        """Get constitution section by code"""
        try:
            result = await self.sections_repo.get_by_code(section_code)
            logger.info(f"Retrieved constitution section by code: {section_code}")
            return result

        except Exception as e:
            logger.error(f"Error getting constitution section by code: {str(e)}")
            raise

    async def get_constitution_hierarchy(
        self, constitution_code: str, section_code: str = None
    ) -> List[Dict[str, Any]]:
        """Get hierarchical tree for constitution sections"""
        try:
            # Execute hierarchy search directly with query
            result = await self.sections_repo.get_hierarchy(constitution_code, section_code)

            logger.info(f"Retrieved hierarchy for constitution: {constitution_code}")
            return result

        except Exception as e:
            logger.error(f"Error getting constitution hierarchy: {str(e)}")
            raise

    async def search_legal_data(self, query: Dict[str, Any]) -> Dict[str, Any]:
        """Search across all legal data"""
        try:
            # Determine search scope
            search_scope = query.get("scope", "all")

            results = {}

            if search_scope in ["all", "constitutions"]:
                # Search constitutions
                constitutions_result = await self.constitutions_repo.search(query)
                results["constitutions"] = constitutions_result

            if search_scope in ["all", "sections"]:
                # Search constitution sections
                sections_result = await self.sections_repo.search(query)
                results["constitution_sections"] = sections_result

            # Add analytics if requested
            if query.get("include_analytics", False):
                analytics = {}

                if search_scope in ["all", "constitutions"]:
                    constitutions_analytics = await self.constitutions_repo.analytics(query)
                    analytics["constitutions"] = constitutions_analytics

                if search_scope in ["all", "sections"]:
                    sections_analytics = await self.sections_repo.analytics(query)
                    analytics["constitution_sections"] = sections_analytics

                results["analytics"] = analytics

            logger.info(
                f"Retrieved legal search results for scope: {search_scope}"
            )
            return results

        except Exception as e:
            logger.error(f"Error searching legal data: {str(e)}")
            raise
