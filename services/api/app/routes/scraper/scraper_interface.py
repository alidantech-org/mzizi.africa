"""
Scraper Interface - Abstract interface for web scraping operations
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session


class ScraperInterface(ABC):
    """Abstract interface for web scraping operations"""

    # === QUERY METHODS ===

    @abstractmethod
    async def list_queries(
        self, status: Optional[str] = None, limit: int = 20, offset: int = 0
    ) -> Dict[str, Any]:
        """List scraping queries with optional filtering"""
        pass

    @abstractmethod
    async def create_query(self, query_config: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new scraping query with schedule"""
        pass

    @abstractmethod
    async def get_query(self, query_id: str) -> Dict[str, Any]:
        """Get details of a specific scraping query"""
        pass

    @abstractmethod
    async def update_query(
        self, query_id: str, query_config: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Update an existing scraping query"""
        pass

    @abstractmethod
    async def run_query(self, query_id: str) -> Dict[str, Any]:
        """Manually trigger a query run"""
        pass

    @abstractmethod
    async def pause_query(self, query_id: str) -> Dict[str, Any]:
        """Pause a scheduled query"""
        pass

    @abstractmethod
    async def resume_query(self, query_id: str) -> Dict[str, Any]:
        """Resume a paused query"""
        pass

    # === SOURCE METHODS ===

    @abstractmethod
    async def list_sources(
        self, source_type: Optional[str] = None, limit: int = 20, offset: int = 0
    ) -> Dict[str, Any]:
        """List scraping sources with optional filtering"""
        pass

    @abstractmethod
    async def configure_source(self, source_config: Dict[str, Any]) -> Dict[str, Any]:
        """Configure a new scraping source"""
        pass

    @abstractmethod
    async def get_source(self, source_id: str) -> Dict[str, Any]:
        """Get details of a specific scraping source"""
        pass

    # === QUERY RUN METHODS ===

    @abstractmethod
    async def list_query_runs(
        self,
        query_id: Optional[str] = None,
        status: Optional[str] = None,
        limit: int = 20,
        offset: int = 0,
    ) -> Dict[str, Any]:
        """List query runs with optional filtering"""
        pass

    @abstractmethod
    async def get_query_run(self, run_id: str) -> Dict[str, Any]:
        """Get details of a specific query run"""
        pass

    @abstractmethod
    async def stop_query_run(self, run_id: str) -> Dict[str, Any]:
        """Stop a running query"""
        pass

    # === RESULTS METHODS ===

    @abstractmethod
    async def get_query_results(
        self, run_id: str, format: str = "json"
    ) -> Dict[str, Any]:
        """Get results of a completed query run"""
        pass

    @abstractmethod
    async def download_query_results(
        self, run_id: str, format: str = "json"
    ) -> Dict[str, Any]:
        """Download query results as file"""
        pass

    # === STATISTICS METHODS ===

    @abstractmethod
    async def get_stats(self) -> Dict[str, Any]:
        """Get overall scraping statistics and analytics"""
        pass

    @abstractmethod
    async def get_query_stats(self, query_id: str) -> Dict[str, Any]:
        """Get statistics for a specific query"""
        pass
