"""
Geographic Interface - Abstract base for geographic operations
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Any


class GeographicInterface(ABC):
    """Abstract interface for geographic operations"""

    @abstractmethod
    async def get_geo_levels(self, query: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Get geographic levels with filtering"""
        pass

    @abstractmethod
    async def get_geo_units(self, query: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Get geographic units with filtering"""
        pass

    @abstractmethod
    async def get_geo_level_analytics(
        self, query: Dict[str, Any]
    ) -> Dict[str, Any] | List[Dict[str, Any]]:
        """Get analytics for geographic levels"""
        pass

    @abstractmethod
    async def get_geo_unit_analytics(
        self, query: Dict[str, Any]
    ) -> Dict[str, Any] | List[Dict[str, Any]]:
        """Get analytics for geographic units"""
        pass

    @abstractmethod
    async def get_geo_hierarchy(self, geo_unit_code: str) -> List[Dict[str, Any]]:
        """Get hierarchical tree for a geographic unit"""
        pass

    @abstractmethod
    async def search_geographic_data(self, query: Dict[str, Any]) -> Dict[str, Any]:
        """Search across all geographic data"""
        pass
