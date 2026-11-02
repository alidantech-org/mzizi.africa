"""
Additional Response Builders for Directory and FileType operations
"""

from typing import Dict, Any, List, Optional
from .response_builders import PaginationBuilder


class DirectoryResponseBuilder:
    """Build directory-related JSON responses"""

    @staticmethod
    def build_directory_dict(directory) -> Dict[str, Any]:
        """Build standardized directory dictionary"""
        return {
            "id": directory.id,
            "name": directory.name,
            "path": directory.path,
            "depth": directory.depth,
            "description": directory.description,
            "parent_id": directory.parent_id,
            "is_active": directory.is_active,
            "file_count": getattr(directory, "file_count", 0),
            "total_size_bytes": getattr(directory, "total_size_bytes", 0),
            "created_at": (
                directory.created_at.isoformat() if directory.created_at else None
            ),
            "updated_at": (
                directory.updated_at.isoformat() if directory.updated_at else None
            ),
        }

    @staticmethod
    def build_directory_list(directories: List) -> List[Dict[str, Any]]:
        """Build list of directory dictionaries"""
        return [
            DirectoryResponseBuilder.build_directory_dict(directory)
            for directory in directories
        ]

    @staticmethod
    def build_tree_response(tree_nodes: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Build directory tree response"""
        return {"tree": tree_nodes, "total_nodes": len(tree_nodes)}


class FileTypeResponseBuilder:
    """Build file type-related JSON responses"""

    @staticmethod
    def build_file_type_dict(file_type) -> Dict[str, Any]:
        """Build standardized file type dictionary"""
        return {
            "id": file_type.id,
            "code": file_type.code,
            "name": file_type.name,
            "mime_type": file_type.mime_type,
            "extension": file_type.extension,
            "description": file_type.description,
            "is_active": file_type.is_active,
            "created_at": (
                file_type.created_at.isoformat() if file_type.created_at else None
            ),
            "updated_at": (
                file_type.updated_at.isoformat() if file_type.updated_at else None
            ),
        }

    @staticmethod
    def build_file_type_list(file_types: List) -> List[Dict[str, Any]]:
        """Build list of file type dictionaries"""
        return [
            FileTypeResponseBuilder.build_file_type_dict(file_type)
            for file_type in file_types
        ]

    @staticmethod
    def build_stats_response(stats: Dict[str, Any]) -> Dict[str, Any]:
        """Build file type statistics response"""
        return {
            "statistics": stats,
            "summary": {
                "total_types": stats.get("total_types", 0),
                "most_common_type": (
                    stats.get("types", [{}])[0].get("name")
                    if stats.get("types")
                    else None
                ),
            },
        }
