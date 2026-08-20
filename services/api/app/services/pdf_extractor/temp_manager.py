"""
Temporary Directory Manager
Handles temporary directory creation and cleanup to avoid permission errors
"""

import tempfile
import shutil
import logging
from pathlib import Path
from typing import List


class TempDirectoryManager:
    """Manages temporary directories for PDF extraction"""
    
    def __init__(self):
        self.temp_dirs: List[Path] = []
        self.logger = logging.getLogger(__name__)
    
    def create_temp_dir(self) -> Path:
        """Create a temporary directory and track it for cleanup"""
        temp_dir = Path(tempfile.mkdtemp())
        self.temp_dirs.append(temp_dir)
        return temp_dir
    
    def cleanup_all_temp_dirs(self):
        """Clean up all temporary directories"""
        for temp_dir in self.temp_dirs:
            try:
                if temp_dir.exists():
                    shutil.rmtree(temp_dir, ignore_errors=True)
                    self.logger.debug(f"Cleaned up temp directory: {temp_dir}")
            except Exception as e:
                self.logger.debug(f"Failed to cleanup temp directory {temp_dir}: {e}")
        
        self.temp_dirs.clear()
    
    def cleanup_temp_dir(self, temp_dir: Path):
        """Clean up a specific temporary directory"""
        try:
            if temp_dir.exists():
                shutil.rmtree(temp_dir, ignore_errors=True)
                self.logger.debug(f"Cleaned up temp directory: {temp_dir}")
                if temp_dir in self.temp_dirs:
                    self.temp_dirs.remove(temp_dir)
        except Exception as e:
            self.logger.debug(f"Failed to cleanup temp directory {temp_dir}: {e}")
