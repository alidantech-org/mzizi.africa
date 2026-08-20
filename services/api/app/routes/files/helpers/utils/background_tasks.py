"""
Background Tasks - Asynchronous task processing for file operations
"""

import asyncio
import logging
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from ...models.directory import Directory
from ...models.file import File


class BackgroundTasks:
    """Background task processor for file and directory operations"""
    
    def __init__(self, db: Session):
        self.db = db
        self.logger = logging.getLogger(__name__)
    
    async def update_folder_statistics(self, directory_id: UUID) -> bool:
        """Update file count and total size for a directory"""
        try:
            # Get the directory
            directory = self.db.execute(
                select(Directory).where(Directory.id == directory_id)
            ).scalar_one_or_none()
            
            if not directory:
                self.logger.warning(f"Directory {directory_id} not found for statistics update")
                return False
            
            # Calculate file count and total size for this directory
            files_stats = self.db.execute(
                select(
                    func.count(File.id).label('file_count'),
                    func.sum(File.size_bytes).label('total_size_bytes')
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
            
            self.logger.info(f"Updated statistics for directory {directory.path}: "
                          f"{directory.file_count} files, {directory.total_size_bytes} bytes")
            
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to update folder statistics for {directory_id}: {e}")
            self.db.rollback()
            return False
    
    async def update_folder_statistics_by_path(self, folder_path: str) -> bool:
        """Update folder statistics by path instead of ID"""
        try:
            # Get directory by path
            directory = self.db.execute(
                select(Directory).where(Directory.path == folder_path)
            ).scalar_one_or_none()
            
            if not directory:
                self.logger.warning(f"Directory path '{folder_path}' not found for statistics update")
                return False
            
            return await self.update_folder_statistics(directory.id)
            
        except Exception as e:
            self.logger.error(f"Failed to update folder statistics by path '{folder_path}': {e}")
            return False
    
    async def update_parent_folder_statistics(self, directory_id: UUID) -> bool:
        """Update statistics for all parent directories up the hierarchy"""
        try:
            # Get the directory and its parents
            directory = self.db.execute(
                select(Directory).where(Directory.id == directory_id)
            ).scalar_one_or_none()
            
            if not directory:
                return False
            
            # Update current directory first
            await self.update_folder_statistics(directory_id)
            
            # Update all parent directories recursively
            current = directory.parent
            while current:
                await self.update_folder_statistics(current.id)
                current = current.parent
            
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to update parent folder statistics: {e}")
            return False


# Global task queue for background processing
_task_queue = asyncio.Queue()


async def background_task_worker():
    """Background worker that processes tasks asynchronously"""
    logger = logging.getLogger(__name__)
    
    while True:
        try:
            task = await _task_queue.get()
            if task is None:  # Shutdown signal
                break
                
            task_func = task.get('func')
            task_args = task.get('args', {})
            task_kwargs = task.get('kwargs', {})
            
            try:
                await task_func(*task_args, **task_kwargs)
                logger.info(f"Background task completed: {task_func.__name__}")
            except Exception as e:
                logger.error(f"Background task failed: {task_func.__name__}: {e}")
                
        except Exception as e:
            logger.error(f"Background worker error: {e}")
        finally:
            _task_queue.task_done()


def schedule_background_task(func, *args, **kwargs):
    """Schedule a task to run in the background"""
    task = {
        'func': func,
        'args': args,
        'kwargs': kwargs
    }
    _task_queue.put_nowait(task)


def start_background_worker():
    """Start the background task worker"""
    asyncio.create_task(background_task_worker())
