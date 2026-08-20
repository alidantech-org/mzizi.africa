"""
Legal Response Builders - Build responses for legal operations
"""

from typing import Dict, Any, List
from app.routes.legal.models.constitutions import Constitutions
from app.routes.legal.models.constitution_sections import ConstitutionSections


class LegalResponseBuilder:
    """Response builder for legal operations"""

    @staticmethod
    def build_constitution_list(
        constitutions: List[Constitutions], include_details: bool = False
    ) -> List[Dict[str, Any]]:
        """Build response for constitutions list"""
        response = []

        for constitution in constitutions:
            constitution_data = {
                "id": constitution.id,
                "constitution_code": constitution.constitution_code,
                "name": constitution.name,
                "effective_from": constitution.effective_from,
                "effective_to": constitution.effective_to,
                "status": constitution.status,
                "document_uri": constitution.document_uri,
                "document_hash": constitution.document_hash,
                "created_at": getattr(constitution, "created_at", None),
                "updated_at": getattr(constitution, "updated_at", None),
            }

            if include_details:
                constitution_data.update(
                    {
                        # Add any additional details if needed
                    }
                )

            response.append(constitution_data)

        return response

    @staticmethod
    def build_constitution_sections_list(
        sections: List[ConstitutionSections],
        include_details: bool = False,
        include_content: bool = False,
    ) -> List[Dict[str, Any]]:
        """Build response for constitution sections list"""
        response = []

        for section in sections:
            section_data = {
                "id": section.id,
                "constitution_id": section.constitution_id,
                "constitution_code": section.constitution_code,
                "parent_section_id": section.parent_section_id,
                "parent_section_code": section.parent_section_code,
                "previous_version_id": section.previous_version_id,
                "previous_version_code": section.previous_version_code,
                "section_type": section.section_type,
                "section_code": section.section_code,
                "title": section.title,
                "sort_order": section.sort_order,
                "valid_from": section.valid_from,
                "valid_to": section.valid_to,
                "transaction_at": section.transaction_at,
                "link_url": section.link_url,
            }

            if include_content and getattr(section, "content", None):
                section_data["content"] = section.content

            if include_details:
                section_data.update(
                    {
                        # Add any additional details if needed
                    }
                )

            response.append(section_data)

        return response

    @staticmethod
    def build_single_constitution(constitution: Constitutions) -> Dict[str, Any]:
        """Build response for single constitution"""
        return {
            "id": constitution.id,
            "constitution_code": constitution.constitution_code,
            "name": constitution.name,
            "effective_from": constitution.effective_from,
            "effective_to": constitution.effective_to,
            "status": constitution.status,
            "document_uri": constitution.document_uri,
            "document_hash": constitution.document_hash,
            "created_at": getattr(constitution, "created_at", None),
            "updated_at": getattr(constitution, "updated_at", None),
        }

    @staticmethod
    def build_single_constitution_section(
        section: ConstitutionSections,
    ) -> Dict[str, Any]:
        """Build response for single constitution section"""
        return {
            "id": section.id,
            "constitution_id": section.constitution_id,
            "constitution_code": section.constitution_code,
            "parent_section_id": section.parent_section_id,
            "parent_section_code": section.parent_section_code,
            "previous_version_id": section.previous_version_id,
            "previous_version_code": section.previous_version_code,
            "section_type": section.section_type,
            "section_code": section.section_code,
            "title": section.title,
            "content": section.content,
            "sort_order": section.sort_order,
            "valid_from": section.valid_from,
            "valid_to": section.valid_to,
            "transaction_at": section.transaction_at,
            "link_url": section.link_url,
        }

    @staticmethod
    def build_analytics_response(analytics_type: str, data: Any) -> Dict[str, Any]:
        """Build response for analytics queries"""
        if analytics_type == "summary":
            if hasattr(data, "total_count"):
                return {
                    "total_count": data.total_count,
                    "distinct_statuses": getattr(data, "distinct_statuses", 0),
                    "earliest_effective_date": getattr(
                        data, "earliest_effective_date", None
                    ),
                    "latest_effective_date": getattr(
                        data, "latest_effective_date", None
                    ),
                }
            else:
                # Handle case where data is just an integer (count)
                if isinstance(data, int):
                    return {
                        "total_count": data,
                        "distinct_statuses": 0,
                        "earliest_effective_date": None,
                        "latest_effective_date": None,
                    }
                else:
                    return {
                        "total_count": getattr(data, "total_count", 0),
                        "distinct_types": getattr(data, "distinct_types", 0),
                        "distinct_constitutions": getattr(
                            data, "distinct_constitutions", 0
                        ),
                    }

        elif analytics_type == "status_stats":
            if hasattr(data, "__iter__"):
                return {
                    "status_stats": [
                        {"status": row.status, "count": row.count} for row in data
                    ]
                }

        elif analytics_type == "type_stats":
            if hasattr(data, "__iter__"):
                return {
                    "type_stats": [
                        {"section_type": row.section_type, "count": row.count}
                        for row in data
                    ]
                }

        return {"analytics_type": analytics_type, "data": data}

    @staticmethod
    def build_hierarchy_tree(
        sections: List[ConstitutionSections],
    ) -> List[Dict[str, Any]]:
        """Build hierarchical tree structure from flat list"""

        # Build tree recursively
        def build_children(parent_code: str = None) -> List[Dict[str, Any]]:
            children = []
            for section in sections:
                # Check if this section has the specified parent
                if parent_code is None and not getattr(
                    section, "parent_section_code", None
                ):
                    # Root section
                    child_data = {
                        "id": section.id,
                        "section_code": section.section_code,
                        "title": section.title,
                        "section_type": section.section_type,
                        "sort_order": section.sort_order,
                        "link_url": getattr(section, "link_url", None),
                        "children": build_children(section.section_code),
                    }
                    children.append(child_data)
                elif getattr(section, "parent_section_code", None) == parent_code:
                    # Child section
                    child_data = {
                        "id": section.id,
                        "section_code": section.section_code,
                        "title": section.title,
                        "section_type": section.section_type,
                        "sort_order": section.sort_order,
                        "link_url": getattr(section, "link_url", None),
                        "children": build_children(section.section_code),
                    }
                    children.append(child_data)
            return children

        # Build hierarchy from root sections
        return build_children()
