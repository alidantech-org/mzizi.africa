"""
File Repository - Database operations for file management
"""

from sqlalchemy import select, func, and_, delete, update, extract
from sqlalchemy.orm import Session
from typing import Dict, Any, List, Optional
from uuid import UUID
from datetime import datetime

from app.routes.files.models.file import File
from app.routes.files.models.dto.file import FileCreate
from ..builders.query_builder import QueryBuilder
from ..builders.response_builders import FileResponseBuilder


class FileRepository:
    """Repository for file database operations"""

    def __init__(self, db: Session):
        self.db = db
        self.query_builder = QueryBuilder()

    async def get_by_id(self, file_id: UUID) -> Optional[File]:
        """Get file by database ID"""
        stmt = select(File).where(File.id == file_id)
        result = self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_s3_key(self, s3_key: str) -> Optional[File]:
        """Get file by S3 key"""
        stmt = select(File).where(File.s3_key == s3_key)
        result = self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def advanced_search(self, query: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Advanced file search with comprehensive filtering"""
        # Build query automatically using query builder
        from sqlalchemy.orm import joinedload

        stmt = self.query_builder.build_search_query(query)

        # Eager load relationships for response building
        stmt = stmt.options(joinedload(File.directory), joinedload(File.file_type_obj))

        # Execute query
        result = self.db.execute(stmt)
        files = result.scalars().all()

        # Get response options
        options = query.get("options", {})
        include_metadata = options.get("include_metadata", False)
        include_urls = options.get("include_urls", False)

        # Build file list using response builder
        return FileResponseBuilder.build_file_list(
            files, include_metadata, include_urls
        )

    async def advanced_search_count(self, query: Dict[str, Any]) -> int:
        """Count files matching advanced search criteria"""
        # Build count query automatically using query builder
        stmt = self.query_builder.build_count_query(query)

        result = self.db.execute(stmt)
        return result.scalar()

    async def delete_by_s3_key(self, s3_key: str) -> bool:
        """Delete file by S3 key"""
        stmt = delete(File).where(File.s3_key == s3_key)
        result = self.db.execute(stmt)
        self.db.commit()
        return result.rowcount > 0

    async def upsert(self, file_data: Dict[str, Any]) -> File:
        """Insert or update file record"""
        s3_key = file_data.get("s3_key")

        # Check if file exists
        existing_file = await self.get_by_s3_key(s3_key)

        if existing_file:
            # Update existing file
            update_data = {k: v for k, v in file_data.items() if k != "s3_key"}
            stmt = (
                update(File)
                .where(File.s3_key == s3_key)
                .values(**update_data)
                .returning(File)
            )
            result = self.db.execute(stmt)
            self.db.commit()
            updated_file = result.scalar_one_or_none()
            if updated_file:
                self.db.refresh(updated_file)
            return updated_file
        else:
            # Create new file
            return await self.create(FileCreate(**file_data))

    async def create(self, file_create: FileCreate) -> File:
        """Create a new file record"""
        db_file = File(**file_create.dict())
        self.db.add(db_file)
        self.db.commit()
        self.db.refresh(db_file)
        return db_file

    async def count_files_by_directory(self, directory_id: UUID) -> int:
        """Count the number of files in a specific directory"""
        stmt = select(func.count(File.id)).where(File.directory_id == directory_id)
        result = self.db.execute(stmt)
        return result.scalar() or 0

    async def get_analytics(self, query: Dict[str, Any]) -> Dict[str, Any]:
        """Get comprehensive file analytics with filtering"""
        # Build base query with filters
        base_filters = self._build_analytics_filters(query.get("filters", {}))

        # Summary statistics
        summary = await self._get_summary_stats(base_filters)

        # File type distribution
        file_type_dist = await self._get_file_type_distribution(base_filters)

        # Folder distribution
        folder_dist = await self._get_folder_distribution(base_filters)

        # Size distribution
        size_dist = await self._get_size_distribution(base_filters)

        # Time series data
        monthly_data = await self._get_monthly_trends(base_filters)
        weekly_data = await self._get_weekly_trends(base_filters)
        daily_data = await self._get_daily_trends(base_filters)
        yearly_data = await self._get_yearly_trends(base_filters)

        return {
            "total_files": summary["total_files"],
            "total_size": summary["total_size"],
            "avg_file_size": summary["avg_file_size"],
            "total_folders": summary["total_folders"],
            "file_type_distribution": file_type_dist,
            "folder_distribution": folder_dist,
            "size_distribution": size_dist,
            "monthly_data": monthly_data,
            "weekly_data": weekly_data,
            "daily_data": daily_data,
            "yearly_data": yearly_data,
        }

    def _build_analytics_filters(self, filters: Dict[str, Any]) -> List[Any]:
        """Build SQLAlchemy filters from analytics filter dict"""
        base_filters = []

        # File type codes filter
        if "file_type_codes" in filters and filters["file_type_codes"]:
            base_filters.append(File.file_type_code.in_(filters["file_type_codes"]))

        # Folder path filter
        if "folder_path" in filters and filters["folder_path"]:
            base_filters.append(File.s3_key.like(f"{filters['folder_path']}%"))

        # Size filter
        if "size" in filters:
            size_filter = filters["size"]
            if "min" in size_filter and size_filter["min"] is not None:
                base_filters.append(File.size_bytes >= size_filter["min"])
            if "max" in size_filter and size_filter["max"] is not None:
                base_filters.append(File.size_bytes <= size_filter["max"])

        # Date range filter
        if "date_range" in filters:
            date_filter = filters["date_range"]
            if "from" in date_filter and date_filter["from"] is not None:
                base_filters.append(File.created_at >= date_filter["from"])
            if "to" in date_filter and date_filter["to"] is not None:
                base_filters.append(File.created_at <= date_filter["to"])

        return base_filters

    async def _get_summary_stats(self, filters: List[Any]) -> Dict[str, Any]:
        """Get summary statistics"""
        base_query = (
            select(
                func.count(File.id).label("total_files"),
                func.sum(File.size_bytes).label("total_size"),
                func.avg(File.size_bytes).label("avg_file_size"),
            ).where(and_(*filters))
            if filters
            else select(
                func.count(File.id).label("total_files"),
                func.sum(File.size_bytes).label("total_size"),
                func.avg(File.size_bytes).label("avg_file_size"),
            )
        )

        result = self.db.execute(base_query)
        row = result.first()

        # Get total folders count
        folder_count_query = select(func.count(func.distinct(File.directory_id)))
        if filters:
            folder_count_query = folder_count_query.where(and_(*filters))

        folder_result = self.db.execute(folder_count_query)
        total_folders = folder_result.scalar() or 0

        return {
            "total_files": row.total_files or 0,
            "total_size": row.total_size or 0,
            "avg_file_size": row.avg_file_size or 0,
            "total_folders": total_folders,
        }

    async def _get_file_type_distribution(
        self, filters: List[Any]
    ) -> List[Dict[str, Any]]:
        """Get file type distribution"""
        base_query = select(
            File.file_type_code,
            func.count(File.id).label("count"),
            func.sum(File.size_bytes).label("total_size"),
        ).group_by(File.file_type_code)

        if filters:
            base_query = base_query.where(and_(*filters))

        result = self.db.execute(base_query)
        return [
            {
                "type": row.file_type_code,
                "count": row.count,
                "size_mb": round((row.total_size or 0) / (1024 * 1024), 2),
            }
            for row in result
        ]

    async def _get_folder_distribution(
        self, filters: List[Any]
    ) -> List[Dict[str, Any]]:
        """Get folder distribution using actual directory structure with depth filtering"""
        # Get folders with depth exactly 1 (first-level folders only)
        from app.routes.files.repositories.directory_repository import (
            DirectoryRepository,
        )

        dir_repo = DirectoryRepository(self.db)

        # Get directories with depth exactly 1
        folders_result = await dir_repo.get_all(
            limit=1000,  # Get all folders up to reasonable limit
            offset=0,
            filters={"depth": {"min": 1, "max": 1}},
        )

        folders = folders_result.get("items", [])
        folder_distribution = []

        for folder in folders:
            # Count files in this folder and its subfolders
            folder_path = folder.get("path", "")

            # Query to count files in this folder path
            file_count_query = select(func.count(File.id)).where(
                File.s3_key.like(f"{folder_path}/%")
            )

            # Query to sum file sizes in this folder path
            size_query = select(func.sum(File.size_bytes)).where(
                File.s3_key.like(f"{folder_path}/%")
            )

            # Apply any additional filters
            if filters:
                file_count_query = file_count_query.where(and_(*filters))
                size_query = size_query.where(and_(*filters))

            # Execute queries
            file_count = self.db.execute(file_count_query).scalar() or 0
            total_size = self.db.execute(size_query).scalar() or 0

            # Extract folder name from full path
            folder_name = (
                folder_path.split("/")[-1] if "/" in folder_path else folder_path
            )

            if file_count > 0:  # Only include folders with files
                folder_distribution.append(
                    {
                        "folder": folder_name,
                        "folder_path": folder_path,
                        "depth": folder.get("depth", 0),
                        "files": file_count,
                        "size_mb": round(total_size / (1024 * 1024), 2),
                    }
                )

        # Sort by file count descending
        folder_distribution.sort(key=lambda x: x["files"], reverse=True)

        return folder_distribution

    async def _get_size_distribution(self, filters: List[Any]) -> List[Dict[str, Any]]:
        """Get size distribution"""
        size_ranges = [
            ("0-1MB", 0, 1024 * 1024),
            ("1-10MB", 1024 * 1024, 10 * 1024 * 1024),
            ("10-50MB", 10 * 1024 * 1024, 50 * 1024 * 1024),
            ("50-100MB", 50 * 1024 * 1024, 100 * 1024 * 1024),
            ("100MB+", 100 * 1024 * 1024, None),
        ]

        distribution = []
        total_files = await self._get_total_files_count(filters)

        for range_name, min_size, max_size in size_ranges:
            if max_size is None:
                # 100MB+ case
                count_query = select(func.count(File.id)).where(
                    File.size_bytes >= min_size
                )
                if filters:
                    count_query = count_query.where(
                        and_(*filters, File.size_bytes >= min_size)
                    )
            else:
                count_query = select(func.count(File.id)).where(
                    and_(File.size_bytes >= min_size, File.size_bytes < max_size)
                )
                if filters:
                    count_query = count_query.where(
                        and_(
                            *filters,
                            File.size_bytes >= min_size,
                            File.size_bytes < max_size,
                        )
                    )

            count = self.db.execute(count_query).scalar() or 0
            percentage = round((count / total_files * 100), 2) if total_files > 0 else 0

            distribution.append(
                {
                    "range": range_name,
                    "count": count,
                    "percentage": percentage,
                }
            )

        return distribution

    async def _get_total_files_count(self, filters: List[Any]) -> int:
        """Get total files count for percentage calculations"""
        count_query = select(func.count(File.id))
        if filters:
            count_query = count_query.where(and_(*filters))
        return self.db.execute(count_query).scalar() or 0

    async def _get_monthly_trends(self, filters: List[Any]) -> List[Dict[str, Any]]:
        """Get monthly upload trends"""
        base_query = (
            select(
                func.date_trunc("month", File.created_at).label("period"),
                func.count(File.id).label("upload_count"),
                func.sum(File.size_bytes).label("total_size"),
                func.count(File.id).label("file_count"),
            )
            .group_by(func.date_trunc("month", File.created_at))
            .order_by(func.date_trunc("month", File.created_at))
        )

        if filters:
            base_query = base_query.where(and_(*filters))

        result = self.db.execute(base_query)

        # Calculate cumulative size
        monthly_data = []
        for row in result:
            monthly_data.append(
                {
                    "period": row.period.strftime("%Y-%m") if row.period else None,
                    "upload_count": row.upload_count,
                    "total_size": int(row.total_size or 0),
                    "file_count": row.file_count,
                }
            )

        return monthly_data

    async def _get_weekly_trends(self, filters: List[Any]) -> List[Dict[str, Any]]:
        """Get weekly upload trends"""
        base_query = (
            select(
                func.date_trunc("week", File.created_at).label("period"),
                func.count(File.id).label("upload_count"),
                func.sum(File.size_bytes).label("total_size"),
                func.count(File.id).label("file_count"),
            )
            .group_by(func.date_trunc("week", File.created_at))
            .order_by(func.date_trunc("week", File.created_at))
        )

        if filters:
            base_query = base_query.where(and_(*filters))

        result = self.db.execute(base_query)

        weekly_data = []
        for row in result:
            weekly_data.append(
                {
                    "period": row.period.strftime("%Y-W%U") if row.period else None,
                    "upload_count": row.upload_count,
                    "total_size": int(row.total_size) or 0,
                    "file_count": row.file_count,
                }
            )

        return weekly_data

    async def _get_yearly_trends(self, filters: List[Any]) -> List[Dict[str, Any]]:
        """Get yearly upload trends"""
        base_query = (
            select(
                func.date_trunc("year", File.created_at).label("period"),
                func.count(File.id).label("upload_count"),
                func.sum(File.size_bytes).label("total_size"),
                func.count(File.id).label("file_count"),
            )
            .group_by(func.date_trunc("year", File.created_at))
            .order_by(func.date_trunc("year", File.created_at))
        )

        if filters:
            base_query = base_query.where(and_(*filters))

        result = self.db.execute(base_query)

        yearly_data = []
        for row in result:
            yearly_data.append(
                {
                    "period": row.period.strftime("%Y") if row.period else None,
                    "upload_count": row.upload_count,
                    "total_size": int(row.total_size or 0),
                    "file_count": row.file_count,
                }
            )

        return yearly_data

    async def _get_daily_trends(self, filters: List[Any]) -> List[Dict[str, Any]]:
        """Get daily upload trends"""
        base_query = (
            select(
                func.date_trunc("day", File.created_at).label("period"),
                func.count(File.id).label("upload_count"),
                func.sum(File.size_bytes).label("total_size"),
                func.count(File.id).label("file_count"),
            )
            .group_by(func.date_trunc("day", File.created_at))
            .order_by(func.date_trunc("day", File.created_at))
        )

        if filters:
            base_query = base_query.where(and_(*filters))

        result = self.db.execute(base_query)

        daily_data = []
        for row in result:
            daily_data.append(
                {
                    "period": row.period.strftime("%Y-%m-%d") if row.period else None,
                    "upload_count": row.upload_count,
                    "total_size": int(row.total_size or 0),
                    "file_count": row.file_count,
                }
            )

        return daily_data
