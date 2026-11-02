"""
Geographic domain repositories.
Simple repositories for GET and analytics requests.
"""

from .geo_levels_repository import GeoLevelsRepository, get_geo_levels_repository
from .geo_units_repository import GeoUnitsRepository, get_geo_units_repository

__all__ = [
    "GeoLevelsRepository",
    "get_geo_levels_repository",
    "GeoUnitsRepository", 
    "get_geo_units_repository",
]
