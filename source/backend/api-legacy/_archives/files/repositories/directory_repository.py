"""
Directory Repository - Database operations for directory management
"""

import logging
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select, func, and_, or_
from sqlalchemy.exc import IntegrityError
from uuid import UUID
from app.routes.files.models.directory import Directory
from ..builders.response_builders import PaginationBuilder
from ..builders.additional_response_builders import DirectoryResponseBuilder


class DirectoryRepository:
    """Repository for directory database operations"""

    def __init__(self, db: Session):
        self.db = db
        self.logger = logging.getLogger(__name__)

    async def create(
        self,
        name: str,
        path: str,
        parent_id: Optional[UUID] = None,
        description: Optional[str] = None,
    ) -> Directory:
        """Create a new directory"""
        # Calculate depth based on parent
        depth = 0
        if parent_id:
            parent = await self.get_by_id(parent_id)
            if parent:
                depth = parent.depth + 1

        directory = Directory(
            name=name,
            path=path,
            parent_id=parent_id,
            depth=depth,
            description=description,
        )
        self.db.add(directory)
        self.db.commit()
        self.db.refresh(directory)
        return directory

    async def get_by_id(self, directory_id: UUID) -> Optional[Directory]:
        """Get directory by ID"""
        stmt = select(Directory).where(Directory.id == directory_id)
        result = self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_path(self, path: str) -> Optional[Directory]:
        """Fetch a directory by its path."""
        stmt = select(Directory).where(Directory.path == path)
        result = self.db.execute(stmt)
        try:
            return result.scalar_one_or_none()
        except Exception as e:
            self.logger.error(f"Error fetching directory by path '{path}': {e}")
            return None

    async def get_or_create_path(self, path: str) -> Directory:
        """Get directory by path or create it if it doesn't exist using optimized reverse search"""
        path = self._normalize_path(path)

        # Step 1: Try full path first (optimistic lookup)
        directory = await self.get_by_path(path)
        if directory:
            return directory

        # Step 2: Find nearest existing parent by searching backwards
        segments = path.split("/")
        parent = None
        existing_depth = 0

        for i in reversed(range(len(segments))):
            partial = "/".join(segments[: i + 1])
            directory = await self.get_by_path(partial)

            if directory:
                parent = directory
                existing_depth = i + 1
                break

        # Step 3: Create remaining segments from existing parent
        current_path = parent.path if parent else ""

        for segment in segments[existing_depth:]:
            current_path = f"{current_path}/{segment}" if current_path else segment

            # Create directory with proper depth calculation
            parent = await self.create(
                name=segment,
                path=current_path,
                parent_id=parent.id if parent else None,
                description=f"Auto-created directory: {current_path}",
            )

        return parent

    async def get_or_create_segment(
        self,
        segment: str,
        path: str,
        parent: Optional[Directory],
    ) -> Directory:
        """Ensure a single directory segment exists with proper error handling."""

        directory = await self.get_by_path(path)
        if directory:
            return directory

        try:
            directory = await self.create(
                name=segment,
                path=path,
                parent_id=parent.id if parent else None,
                description=f"Auto-created directory: {path}",
            )
            return directory

        except IntegrityError:
            # Another process created it concurrently - retry once
            await self.db.rollback()
            directory = await self.get_by_path(path)
            if directory:
                return directory

            # If still not found, try creating again
            return await self.create(
                name=segment,
                path=path,
                parent_id=parent.id if parent else None,
                description=f"Auto-created directory: {path} (retry)",
            )

    def _get_path_variations(self, path: str) -> List[str]:
        """Get all possible variations of a path for searching"""
        variations = [path]  # The path itself

        # Add variations with leading slash
        if not path.startswith("/"):
            variations.append(f"/{path}")

        return variations

    @staticmethod
    def _normalize_path(path: str) -> str:
        """Normalize path to consistent format without leading slash"""
        if not path:
            return ""

        # Remove leading slash
        if path.startswith("/"):
            path = path[1:]

        # Remove trailing slash
        if path.endswith("/") and path != "/":
            path = path.rstrip("/")

        return path

    async def _create_root_directory(self) -> Directory:
        """Create a root directory with depth 0"""
        # Use a generic root name or check if one exists
        existing_root = await self.get_by_path("")
        if existing_root:
            return existing_root

        root_directory = Directory(
            name="root",
            path="",
            parent_id=None,
            depth=0,
            description="Root directory",
        )
        self.db.add(root_directory)
        self.db.commit()
        self.db.refresh(root_directory)
        return root_directory

    async def get_children(self, parent_id: UUID) -> List[Directory]:
        """Get all child directories of a parent"""
        stmt = (
            select(Directory)
            .where(Directory.parent_id == parent_id)
            .order_by(Directory.name)
        )
        result = self.db.execute(stmt)
        return result.scalars().all()

    async def get_tree(self, root_path: str = "/") -> Dict[str, Any]:
        """Get directory tree structure"""
        root_dir = await self.get_by_path(root_path)
        if not root_dir:
            return DirectoryResponseBuilder.build_tree_response([])

        tree_nodes = await self._build_tree(root_dir)
        return DirectoryResponseBuilder.build_tree_response(tree_nodes)

    async def _build_tree(self, directory: Directory) -> List[Dict[str, Any]]:
        """Build tree structure recursively"""
        children = await self.get_children(directory.id)

        tree_node = {
            "id": directory.id,
            "name": directory.name,
            "path": directory.path,
            "depth": directory.depth,
            "description": directory.description,
            "created_at": (
                directory.created_at.isoformat() if directory.created_at else None
            ),
            "children": [],
        }

        for child in children:
            child_tree = await self._build_tree(child)
            tree_node["children"].append(child_tree)

        return [tree_node]

    async def get_all(
        self,
        limit: int = 100,
        offset: int = 0,
        filters: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Get all directories with pagination and filtering"""
        from ..builders.directory_query_builder import DirectoryQueryBuilder

        # Handle path filtering specially - find parent and return direct children
        if filters and "path" in filters:
            return await self._get_direct_children_of_path(
                filters["path"]["exact"], limit, offset
            )

        query_builder = DirectoryQueryBuilder()

        # Build query parameters
        query_params = {
            "filters": filters or {},
            "sort": {"field": "path", "order": "asc"},
            "pagination": {"limit": limit, "offset": offset},
        }

        # Execute search query
        stmt = query_builder.build_search_query(query_params)
        result = self.db.execute(stmt)
        directories = result.scalars().all()

        # Get total count
        count_stmt = query_builder.build_count_query(query_params)
        total_result = self.db.execute(count_stmt)
        total = total_result.scalar()

        # Build directory list using response builder (statistics are already in DB fields)
        directory_list = DirectoryResponseBuilder.build_directory_list(directories)

        return PaginationBuilder.build_pagination_response(
            items=directory_list, total=total, limit=limit, offset=offset
        )

    async def _get_direct_children_of_path(
        self, exact_path: str, limit: int = 100, offset: int = 0
    ) -> Dict[str, Any]:
        """Get direct children of a folder with the specified path"""
        # First find the parent directory by exact path
        parent_stmt = select(Directory).where(Directory.path == exact_path)
        parent_result = self.db.execute(parent_stmt)
        parent_directory = parent_result.scalar_one_or_none()

        if not parent_directory:
            # Parent directory not found, return empty result
            return PaginationBuilder.build_pagination_response(
                items=[], total=0, limit=limit, offset=offset
            )

        # Now get direct children of this parent
        children_stmt = (
            select(Directory)
            .where(Directory.parent_id == parent_directory.id)
            .where(Directory.is_active == True)
            .order_by(Directory.path)
            .offset(offset)
            .limit(limit)
        )

        children_result = self.db.execute(children_stmt)
        children = children_result.scalars().all()

        # Get total count of direct children
        count_stmt = (
            select(func.count(Directory.id))
            .where(Directory.parent_id == parent_directory.id)
            .where(Directory.is_active == True)
        )
        total_result = self.db.execute(count_stmt)
        total = total_result.scalar()

        # Build directory list using response builder
        directory_list = DirectoryResponseBuilder.build_directory_list(children)

        return PaginationBuilder.build_pagination_response(
            items=directory_list, total=total, limit=limit, offset=offset
        )

    async def search(self, query: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Search directories by name or path"""
        stmt = (
            select(Directory)
            .where(
                or_(
                    Directory.name.ilike(f"%{query}%"),
                    Directory.path.ilike(f"%{query}%"),
                )
            )
            .order_by(Directory.path)
            .limit(limit)
        )
        result = self.db.execute(stmt)
        directories = result.scalars().all()

        return DirectoryResponseBuilder.build_directory_list(directories)

    async def update(self, directory_id: UUID, **kwargs) -> Optional[Directory]:
        """Update directory"""
        directory = await self.get_by_id(directory_id)
        if not directory:
            return None

        for key, value in kwargs.items():
            if hasattr(directory, key):
                setattr(directory, key, value)

        self.db.commit()
        self.db.refresh(directory)
        return directory

    async def update_statistics_for_directory(self, directory_id: str) -> bool:
        """Update file count and total size for a specific directory"""
        try:
            from ..models.file import File
            from sqlalchemy import select, func

            # Get the directory
            directory = self.db.execute(
                select(Directory).where(Directory.id == directory_id)
            ).scalar_one_or_none()

            if not directory:
                self.logger.warning(
                    f"Directory {directory_id} not found for statistics update"
                )
                return False

            # Calculate file count and total size for this directory
            files_stats = self.db.execute(
                select(
                    func.count(File.id).label("file_count"),
                    func.sum(File.size_bytes).label("total_size_bytes"),
                ).where(File.directory_id == directory_id)
            ).one()

            # Update directory with new statistics
            directory.file_count = files_stats.file_count or 0
            directory.total_size_bytes = files_stats.total_size_bytes or 0

            # Update last_file_at timestamp if there are files
            if files_stats.file_count > 0:
                latest_file = self.db.execute(
                    select(File.created_at)
                    .where(File.directory_id == directory_id)
                    .order_by(File.created_at.desc())
                    .limit(1)
                ).scalar_one_or_none()

                if latest_file:
                    directory.last_file_at = latest_file

            self.db.commit()
            self.db.refresh(directory)

            self.logger.info(
                f"Updated statistics for directory {directory.path}: "
                f"{directory.file_count} files, {directory.total_size_bytes} bytes"
            )

            return True

        except Exception as e:
            self.logger.error(
                f"Failed to update folder statistics for {directory_id}: {e}"
            )
            self.db.rollback()
            return False

    async def delete(self, directory_id: UUID) -> bool:
        """Delete directory (will also delete all children and files)"""
        directory = await self.get_by_id(directory_id)
        if not directory:
            return False

        self.db.delete(directory)
        self.db.commit()
        return True

    async def is_directory_empty(self, directory_id: UUID) -> bool:
        """Check if directory has no files and no subdirectories"""
        from sqlalchemy import select, func
        from .files_repository import FileRepository

        # Check for files in this directory using files repository
        files_repository = FileRepository(self.db)
        files_count = await files_repository.count_files_by_directory(directory_id)

        if files_count > 0:
            return False

        # Check for subdirectories
        children_count_stmt = select(func.count(Directory.id)).where(
            Directory.parent_id == directory_id
        )
        children_count_result = self.db.execute(children_count_stmt)
        children_count = children_count_result.scalar()

        return children_count == 0

    async def cleanup_empty_directories(self, directory_id: UUID) -> List[UUID]:
        """Recursively delete empty directories starting from the given directory, excluding depth 0"""
        deleted_directories = []

        # Get the directory to check
        directory = await self.get_by_id(directory_id)
        if not directory:
            return deleted_directories

        # Don't delete root directories (depth 0)
        if directory.depth == 0:
            return deleted_directories

        # Check if current directory is empty
        if await self.is_directory_empty(directory_id):
            # Get parent ID before deletion for recursion
            parent_id = directory.parent_id

            # Delete the empty directory
            await self.delete(directory_id)
            deleted_directories.append(directory_id)
            self.logger.info(f"Deleted empty directory: {directory.path}")

            # Recursively check parent directory
            if parent_id:
                parent_deleted = await self.cleanup_empty_directories(parent_id)
                deleted_directories.extend(parent_deleted)

        return deleted_directories
