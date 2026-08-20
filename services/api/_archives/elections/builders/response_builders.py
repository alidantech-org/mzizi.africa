"""
Response Builders - Reusable JSON construction for API responses
"""

from typing import Dict, Any, List, Optional
from datetime import datetime
from uuid import UUID


class PaginationBuilder:
    """Build pagination response structure"""

    @staticmethod
    def build_pagination_response(
        items: List[Dict[str, Any]],
        total: int,
        limit: int,
        offset: int,
        additional_data: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Build standardized pagination response"""
        response = {
            "items": items,
            "pagination": {
                "limit": limit,
                "offset": offset,
                "total": total,
                "has_more": offset + limit < total,
            },
        }

        if additional_data:
            response.update(additional_data)

        return response


class FileResponseBuilder:
    """Build file-related JSON responses"""

    @staticmethod
    def build_file_dict(
        file, include_metadata: bool = False, include_urls: bool = False
    ) -> Dict[str, Any]:
        """Build standardized file dictionary from File model"""
        file_dict = {
            "id": file.id,
            "filename": file.filename,
            "s3_key": file.s3_key,
            "s3_bucket": file.s3_bucket,
            "file_type_code": file.file_type_code,
            "content_type": file.mime_type,
            "size_bytes": file.size_bytes,
            "directory_id": file.directory_id,
            "checksum": file.checksum,
            "created_at": file.created_at.isoformat() if file.created_at else None,
            "updated_at": file.updated_at.isoformat() if file.updated_at else None,
        }

        # Add optional fields
        if include_metadata and file.file_metadata:
            file_dict["file_metadata"] = file.file_metadata

        if include_urls:
            if hasattr(file, "public_url") and file.public_url:
                file_dict["public_url"] = file.public_url

        return file_dict

    @staticmethod
    def build_file_list(
        files: List, include_metadata: bool = False, include_urls: bool = False
    ) -> List[Dict[str, Any]]:
        """Build list of file dictionaries"""
        return [
            FileResponseBuilder.build_file_dict(file, include_metadata, include_urls)
            for file in files
        ]


class SearchResponseBuilder:
    """Build search response with statistics"""

    @staticmethod
    def build_search_response(
        files: List[Dict[str, Any]],
        total: int,
        limit: int,
        offset: int,
        search_time_ms: float,
        filters: Dict[str, Any],
        include_stats: bool = True,
        stats: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Build standardized search response"""
        response = {
            "files": files,
            "pagination": {
                "limit": limit,
                "offset": offset,
                "total": total,
                "has_more": offset + limit < total,
            },
            "search_time_ms": round(search_time_ms, 2),
            "applied_filters": filters,
        }

        if include_stats and stats:
            response.update(stats)

        return response


class FileTypeResponseBuilder:
    """Build file type response"""

    @staticmethod
    def build_file_type_response(
        file_types: List[Dict[str, Any]],
        total: int,
        limit: int,
        offset: int,
        additional_data: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Build standardized file type response"""
        response = {
            "file_types": file_types,
            "pagination": {
                "limit": limit,
                "offset": offset,
                "total": total,
                "has_more": offset + limit < total,
            },
        }

        if additional_data:
            response.update(additional_data)

        return response


class FolderResponseBuilder:
    """Build folder structure response"""

    @staticmethod
    def build_folder_response(
        folders: List[Dict[str, Any]], total: int, limit: int, offset: int
    ) -> Dict[str, Any]:
        """Build standardized folder response"""
        response = {
            "folders": folders,
            "pagination": {
                "limit": limit,
                "offset": offset,
                "total": total,
                "has_more": offset + limit < total,
            },
        }
        return response


class DeleteResponseBuilder:
    """Build delete operation response"""

    @staticmethod
    def build_delete_response(
        s3_key: str,
        s3_deleted: bool,
        db_deleted: bool,
        error_message: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Build standardized delete response"""
        response = {
            "s3_key": s3_key,
            "s3_deleted": s3_deleted,
            "db_deleted": db_deleted,
            "success": s3_deleted or db_deleted,
        }

        if error_message:
            response["error"] = error_message

        return response
