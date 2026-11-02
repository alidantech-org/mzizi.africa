"""
FileType Repository - Database operations for file type management
"""

from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select, and_, or_, func
from app.routes.files.models.file_type import FileType
from ..builders.response_builders import PaginationBuilder
from ..builders.additional_response_builders import FileTypeResponseBuilder


class FileTypeRepository:
    """Repository for file type database operations"""

    def __init__(self, db: Session):
        self.db = db

    async def create(self, **kwargs) -> FileType:
        """Create a new file type"""
        file_type = FileType(**kwargs)
        self.db.add(file_type)
        self.db.commit()
        self.db.refresh(file_type)
        return file_type

    async def get_by_id(self, file_type_id: int) -> Optional[FileType]:
        """Get file type by ID"""
        stmt = select(FileType).where(FileType.id == file_type_id)
        result = self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_code(self, code: str) -> Optional[FileType]:
        """Get file type by code"""
        stmt = select(FileType).where(FileType.code == code)
        result = self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_mime_type(self, mime_type: str) -> Optional[FileType]:
        """Get file type by MIME type"""
        stmt = select(FileType).where(FileType.mime_type == mime_type)
        result = self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_extension(self, extension: str) -> Optional[FileType]:
        """Get file type by file extension"""
        # Clean extension
        if extension.startswith("."):
            extension = extension[1:]
        extension = extension.lower()

        stmt = select(FileType).where(
            or_(FileType.extension == f".{extension}", FileType.extension == extension)
        )
        result = self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_or_create_by_mime_type(
        self, mime_type: str, extension: str
    ) -> FileType:
        """Get file type by MIME type or create a new one"""
        # Try to find existing file type
        file_type = await self.get_by_mime_type(mime_type)
        if file_type:
            return file_type

        # Try to find by extension
        file_type = await self.get_by_extension(extension)
        if file_type:
            return file_type

        # Create new file type
        code = extension.lower().replace(".", "")
        name = extension.upper() + " files"

        # Determine category from MIME type
        category = self._determine_category_from_mime_type(mime_type)

        file_type = await self.create(
            code=code,
            name=name,
            mime_type=mime_type,
            extension=extension,
            category=category,
            description=f"Auto-created file type for {mime_type}",
        )

        return file_type

    def _determine_category_from_mime_type(self, mime_type: str) -> str:
        """Determine file category from MIME type"""
        if mime_type.startswith("image/"):
            return "image"
        elif mime_type.startswith("video/"):
            return "video"
        elif mime_type.startswith("audio/"):
            return "audio"
        elif mime_type.startswith("text/"):
            return "text"
        elif mime_type in ["application/pdf"]:
            return "document"
        elif mime_type in [
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ]:
            return "document"
        elif mime_type in [
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ]:
            return "spreadsheet"
        elif mime_type in [
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ]:
            return "presentation"
        elif mime_type in [
            "application/json",
            "application/xml",
            "text/csv",
            "text/html",
            "text/css",
            "text/javascript",
        ]:
            return "code"
        elif mime_type in [
            "application/zip",
            "application/x-rar-compressed",
            "application/x-7z-compressed",
            "application/gzip",
            "application/x-tar",
        ]:
            return "archive"
        else:
            return "other"

    async def get_all(
        self,
        limit: int = 100,
        offset: int = 0,
        filters: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Get all file types with pagination and filtering"""
        from ..builders.file_type_query_builder import FileTypeQueryBuilder

        query_builder = FileTypeQueryBuilder()

        # Build query parameters
        query_params = {
            "filters": filters or {},
            "sort": {"field": "name", "order": "asc"},
            "pagination": {"limit": limit, "offset": offset},
        }

        # Execute search query
        stmt = query_builder.build_search_query(query_params)
        result = self.db.execute(stmt)
        file_types = result.scalars().all()

        # Get total count
        count_stmt = query_builder.build_count_query(query_params)
        total_result = self.db.execute(count_stmt)
        total = total_result.scalar()

        # Build file type list using response builder
        file_type_list = FileTypeResponseBuilder.build_file_type_list(file_types)

        return PaginationBuilder.build_pagination_response(
            items=file_type_list, total=total, limit=limit, offset=offset
        )

    async def get_active_types(self) -> List[Dict[str, Any]]:
        """Get all active file types"""
        stmt = (
            select(FileType).where(FileType.is_active == True).order_by(FileType.name)
        )
        result = self.db.execute(stmt)
        file_types = result.scalars().all()

        return FileTypeResponseBuilder.build_file_type_list(file_types)

    async def get_type_stats(self) -> Dict[str, Any]:
        """Get file type statistics"""
        from app.routes.files.models.file import File

        stmt = (
            select(
                FileType.code,
                FileType.name,
                func.count(File.id).label("file_count"),
                func.sum(File.size_bytes).label("total_size"),
                func.avg(File.size_bytes).label("avg_size"),
            )
            .outerjoin(File, FileType.code == File.file_type_code)
            .group_by(FileType.id, FileType.code, FileType.name)
            .order_by(func.count(File.id).desc())
        )

        result = self.db.execute(stmt)

        stats = []
        for row in result:
            stats.append(
                {
                    "code": row.code,
                    "name": row.name,
                    "file_count": row.file_count or 0,
                    "total_size": row.total_size or 0,
                    "avg_size": row.avg_size or 0,
                }
            )

        return FileTypeResponseBuilder.build_stats_response(
            {"total_types": len(stats), "types": stats}
        )

    async def search(self, query: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Search file types by name, code, or extension"""
        stmt = (
            select(FileType)
            .where(
                or_(
                    FileType.name.ilike(f"%{query}%"),
                    FileType.code.ilike(f"%{query}%"),
                    FileType.extension.ilike(f"%{query}%"),
                    FileType.mime_type.ilike(f"%{query}%"),
                )
            )
            .order_by(FileType.name)
            .limit(limit)
        )
        result = self.db.execute(stmt)
        file_types = result.scalars().all()

        return FileTypeResponseBuilder.build_file_type_list(file_types)

    async def update(self, file_type_id: int, **kwargs) -> Optional[FileType]:
        """Update file type"""
        file_type = await self.get_by_id(file_type_id)
        if not file_type:
            return None

        for key, value in kwargs.items():
            if hasattr(file_type, key):
                setattr(file_type, key, value)

        self.db.commit()
        self.db.refresh(file_type)
        return file_type

    async def delete(self, file_type_id: int) -> bool:
        """Delete file type"""
        file_type = await self.get_by_id(file_type_id)
        if not file_type:
            return False

        self.db.delete(file_type)
        self.db.commit()
        return True

    async def get_all_categories(self) -> List[str]:
        """Get all unique file type categories from the database"""
        stmt = select(FileType.category).where(FileType.category.isnot(None)).distinct()
        result = self.db.execute(stmt)
        categories = [row[0] for row in result]
        return sorted(categories)

    async def get_codes_by_category(self, category: str) -> List[str]:
        """Get all file type codes belonging to a specific category"""
        stmt = select(FileType.code).where(FileType.category == category)
        result = self.db.execute(stmt)
        codes = [row[0] for row in result]
        return codes
