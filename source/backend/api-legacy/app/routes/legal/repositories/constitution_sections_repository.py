"""
Constitution Sections Repository - Database operations for constitution sections
"""

from sqlalchemy.orm import Session
from typing import Dict, Any, List
from app.config.database import get_db
from app.routes.legal.models.constitution_sections import ConstitutionSections
from .builders.constitution_query_builder import ConstitutionQueryBuilder
from .builders.response_builders import LegalResponseBuilder


class ConstitutionSectionsRepository:
    """Repository for constitution sections database operations"""

    def __init__(self, db: Session):
        self.db = db
        self.query_builder = ConstitutionQueryBuilder()

    async def search(self, query: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Search constitution sections with comprehensive filtering"""
        # Set model to ConstitutionSections
        query["model"] = ConstitutionSections

        # Flatten filters into main query
        filters = query.get("filters", {})
        query.update(filters)

        # Build query automatically using query builder
        stmt = self.query_builder.build_search_query(query)

        # Execute query
        result = self.db.execute(stmt)
        sections = result.scalars().all()

        # Get response options
        options = query.get("options", {})
        include_details = options.get("include_details", False)
        include_content = options.get("include_content", False)

        # Build response using response builder
        return LegalResponseBuilder.build_constitution_sections_list(
            sections, include_details, include_content
        )

    async def analytics(
        self, query: Dict[str, Any]
    ) -> Dict[str, Any] | List[Dict[str, Any]]:
        """Get analytics for constitution sections"""
        # Set model to ConstitutionSections
        query["model"] = ConstitutionSections

        # Get analytics type
        analytics_type = query.get("analytics_type", "summary")

        # Build analytics query
        stmt = self.query_builder.build_analytics_query(query)

        # Execute query
        result = self.db.execute(stmt)

        if analytics_type == "type_stats":
            analytics_data = result.scalars().all()
        else:
            analytics_data = result.scalar_one_or_none()

        # Build response using response builder
        return LegalResponseBuilder.build_analytics_response(
            analytics_type, analytics_data
        )

    async def get_by_id(self, section_id: str) -> Dict[str, Any] | None:
        """Get constitution section by ID"""
        stmt = self.query_builder.build_section_by_id_query(section_id)
        result = self.db.execute(stmt)
        section = result.scalar_one_or_none()

        if not section:
            return None

        return LegalResponseBuilder.build_single_constitution_section(section)

    async def get_by_code(self, section_code: str) -> Dict[str, Any] | None:
        """Get constitution section by code"""
        stmt = self.query_builder.build_section_by_code_query(section_code)
        result = self.db.execute(stmt)
        section = result.scalar_one_or_none()

        if not section:
            return None

        return LegalResponseBuilder.build_single_constitution_section(section)

    async def get_hierarchy(
        self, constitution_code: str, section_code: str = None
    ) -> List[Dict[str, Any]]:
        """Get hierarchical structure of constitution sections"""
        stmt = self.query_builder.build_hierarchy_query(constitution_code, section_code)
        result = self.db.execute(stmt)
        sections = result.scalars().all()

        return LegalResponseBuilder.build_hierarchy_tree(sections)


# Dependency injection helper
def get_constitution_sections_repository() -> ConstitutionSectionsRepository:
    """Get ConstitutionSections repository instance."""
    db = next(get_db())
    return ConstitutionSectionsRepository(db)
