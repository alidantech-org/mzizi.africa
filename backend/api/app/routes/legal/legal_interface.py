"""
Legal Interface - Abstract base for legal operations
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Any


class LegalInterface(ABC):
    """Abstract interface for legal operations"""

    @abstractmethod
    async def get_constitutions(self, query: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Get constitutions with filtering"""
        pass

    @abstractmethod
    async def get_constitution_sections(self, query: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Get constitution sections with filtering"""
        pass

    @abstractmethod
    async def get_constitution_analytics(
        self, query: Dict[str, Any]
    ) -> Dict[str, Any] | List[Dict[str, Any]]:
        """Get analytics for constitutions"""
        pass

    @abstractmethod
    async def get_constitution_sections_analytics(
        self, query: Dict[str, Any]
    ) -> Dict[str, Any] | List[Dict[str, Any]]:
        """Get analytics for constitution sections"""
        pass

    @abstractmethod
    async def get_constitution_by_id(self, constitution_id: str) -> Dict[str, Any] | None:
        """Get constitution by ID"""
        pass

    @abstractmethod
    async def get_constitution_by_code(self, constitution_code: str) -> Dict[str, Any] | None:
        """Get constitution by code"""
        pass

    @abstractmethod
    async def get_constitution_section_by_id(self, section_id: str) -> Dict[str, Any] | None:
        """Get constitution section by ID"""
        pass

    @abstractmethod
    async def get_constitution_section_by_code(self, section_code: str) -> Dict[str, Any] | None:
        """Get constitution section by code"""
        pass

    @abstractmethod
    async def get_constitution_hierarchy(
        self, constitution_code: str, section_code: str = None
    ) -> List[Dict[str, Any]]:
        """Get hierarchical tree for constitution sections"""
        pass

    @abstractmethod
    async def search_legal_data(self, query: Dict[str, Any]) -> Dict[str, Any]:
        """Search across all legal data"""
        pass
