"""
Constitution Query Builder - Build SQL queries for constitution operations
"""

from sqlalchemy import select, and_, or_, func
from typing import Dict, Any, TYPE_CHECKING
from app.routes.legal.models.constitutions import Constitutions
from app.routes.legal.models.constitution_sections import ConstitutionSections

if TYPE_CHECKING:
    from sqlalchemy.sql.selectable import Select


class ConstitutionQueryBuilder:
    """Builder class for constructing constitution queries"""

    def build_search_query(self, query: Dict[str, Any]) -> "Select":
        """Build search query for constitutions or sections"""
        model = query.get("model", Constitutions)

        # Start with base query
        stmt = select(model)

        # Add filters
        filters = []

        # ID filter
        if query.get("id"):
            filters.append(model.id == query["id"])

        # Constitution code filter
        if query.get("constitution_code"):
            filters.append(model.constitution_code == query["constitution_code"])

        # Name filter (case-insensitive)
        if query.get("name"):
            filters.append(model.name.ilike(f'%{query["name"]}%'))

        # Status filter
        if query.get("status") is not None:
            filters.append(model.status == query["status"])

        # Date range filter
        if query.get("effective_from") and query.get("effective_to"):
            filters.append(
                and_(
                    model.effective_from >= query["effective_from"],
                    model.effective_to <= query["effective_to"],
                )
            )

        # Section-specific filters
        if model == ConstitutionSections:
            # Section code filter
            if query.get("section_code"):
                filters.append(model.section_code == query["section_code"])

            # Section type filter
            if query.get("section_type"):
                filters.append(model.section_type == query["section_type"])

            # Parent section filter
            if query.get("parent_section_code"):
                filters.append(
                    model.parent_section_code == query["parent_section_code"]
                )

            # Search term filter for sections
            if query.get("search_term"):
                search_term = f'%{query["search_term"]}%'
                search_filter = or_(
                    model.title.ilike(search_term),
                    model.content.ilike(search_term) if model.content else None,
                    model.section_code.ilike(search_term),
                )
                filters.append(search_filter)

        # Apply filters
        if filters:
            stmt = stmt.where(and_(*filters))

        # Add ordering
        order_by = query.get("order_by")
        if order_by and hasattr(model, order_by):
            stmt = stmt.order_by(getattr(model, order_by))
        else:
            # Default ordering
            if hasattr(model, "effective_from"):
                stmt = stmt.order_by(model.effective_from.desc())
            elif hasattr(model, "sort_order"):
                stmt = stmt.order_by(model.sort_order)
            elif hasattr(model, "name"):
                stmt = stmt.order_by(model.name)

        # Add limit
        if query.get("limit"):
            stmt = stmt.limit(query["limit"])

        # Add offset
        if query.get("offset"):
            stmt = stmt.offset(query["offset"])

        return stmt

    def build_analytics_query(self, query: Dict[str, Any]) -> "Select":
        """Build analytics query for constitutions or sections"""
        model = query.get("model", Constitutions)
        analytics_type = query.get("analytics_type", "summary")

        if analytics_type == "summary":
            if model == Constitutions:
                return select(
                    func.count(model.id).label("total_count"),
                    func.count(func.distinct(model.status)).label("distinct_statuses"),
                    func.min(model.effective_from).label("earliest_effective_date"),
                    func.max(model.effective_from).label("latest_effective_date"),
                )
            elif model == ConstitutionSections:
                return select(
                    func.count(model.id).label("total_count"),
                    func.count(func.distinct(model.section_type)).label(
                        "distinct_types"
                    ),
                    func.count(func.distinct(model.constitution_code)).label(
                        "distinct_constitutions"
                    ),
                )

        elif analytics_type == "status_stats" and model == Constitutions:
            return select(model.status, func.count(model.id).label("count")).group_by(
                model.status
            )

        elif analytics_type == "type_stats" and model == ConstitutionSections:
            return select(
                model.section_type, func.count(model.id).label("count")
            ).group_by(model.section_type)

        # Default to basic count
        return select(func.count(model.id))

    def build_by_id_query(self, constitution_id: str) -> "Select":
        """Build query to get constitution by ID"""
        return select(Constitutions).where(Constitutions.id == constitution_id)

    def build_by_code_query(self, constitution_code: str) -> "Select":
        """Build query to get constitution by code"""
        return select(Constitutions).where(
            Constitutions.constitution_code == constitution_code
        )

    def build_section_by_id_query(self, section_id: str) -> "Select":
        """Build query to get constitution section by ID"""
        return select(ConstitutionSections).where(ConstitutionSections.id == section_id)

    def build_section_by_code_query(self, section_code: str) -> "Select":
        """Build query to get constitution section by code"""
        return select(ConstitutionSections).where(
            ConstitutionSections.section_code == section_code
        )

    def build_hierarchy_query(
        self, constitution_code: str, section_code: str = None
    ) -> "Select":
        """Build query to get hierarchical structure"""
        stmt = select(ConstitutionSections).where(
            ConstitutionSections.constitution_code == constitution_code
        )

        if section_code:
            stmt = stmt.where(ConstitutionSections.section_code == section_code)

        return stmt.order_by(ConstitutionSections.sort_order)
