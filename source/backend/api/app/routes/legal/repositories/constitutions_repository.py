"""
Constitutions Repository - Database operations for constitutions
"""

from sqlalchemy.orm import Session
from typing import Dict, Any, List
from app.config.database import get_db
from app.routes.legal.models.constitutions import Constitutions
from .builders.constitution_query_builder import ConstitutionQueryBuilder
from .builders.response_builders import LegalResponseBuilder


class ConstitutionsRepository:
    """Repository for constitutions database operations"""

    def __init__(self, db: Session):
        self.db = db
        self.query_builder = ConstitutionQueryBuilder()

    async def search(self, query: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Search constitutions with comprehensive filtering"""
        # Set model to Constitutions
        query["model"] = Constitutions

        # Flatten filters into main query
        filters = query.get("filters", {})
        query.update(filters)

        # Build query automatically using query builder
        stmt = self.query_builder.build_search_query(query)

        # Execute query
        result = self.db.execute(stmt)
        constitutions = result.scalars().all()

        # Get response options
        options = query.get("options", {})
        include_details = options.get("include_details", False)

        # Build response using response builder
        return LegalResponseBuilder.build_constitution_list(
            constitutions, include_details
        )

    async def analytics(
        self, query: Dict[str, Any]
    ) -> Dict[str, Any] | List[Dict[str, Any]]:
        """Get analytics for constitutions"""
        # Set model to Constitutions
        query["model"] = Constitutions

        # Get analytics type
        analytics_type = query.get("analytics_type", "summary")

        # Build analytics query
        stmt = self.query_builder.build_analytics_query(query)

        # Execute query
        result = self.db.execute(stmt)

        if analytics_type == "status_stats":
            analytics_data = result.scalars().all()
        else:
            analytics_data = result.scalar_one_or_none()

        # Build response using response builder
        return LegalResponseBuilder.build_analytics_response(
            analytics_type, analytics_data
        )

    async def get_by_id(self, constitution_id: str) -> Dict[str, Any] | None:
        """Get constitution by ID"""
        stmt = self.query_builder.build_by_id_query(constitution_id)
        result = self.db.execute(stmt)
        constitution = result.scalar_one_or_none()

        if not constitution:
            return None

        return LegalResponseBuilder.build_single_constitution(constitution)

    async def get_by_code(self, constitution_code: str) -> Dict[str, Any] | None:
        """Get constitution by code"""
        stmt = self.query_builder.build_by_code_query(constitution_code)
        result = self.db.execute(stmt)
        constitution = result.scalar_one_or_none()

        if not constitution:
            return None

        return LegalResponseBuilder.build_single_constitution(constitution)


# Dependency injection helper
def get_constitutions_repository() -> ConstitutionsRepository:
    """Get Constitutions repository instance."""
    db = next(get_db())
    return ConstitutionsRepository(db)
