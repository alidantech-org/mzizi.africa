"""
Land domain models - spatial units, tenure types, rights/restrictions, and land authorities.
Based on LADM (ISO 19152) standard with Kenyan constitutional land classification.
The "mother" of all domains - every office and amenity must sit on specific legal land.
"""

from .spatial_units import SpatialUnits, UnitTypeEnum, LandClassificationEnum
from .tenure_types import TenureTypes, TenureCategoryEnum
from .rights_restrictions import RightsRestrictions, RightTypeEnum, RestrictionTypeEnum
from .land_authorities import LandAuthorities, AuthorityRoleEnum

__all__ = [
    "SpatialUnits",
    "UnitTypeEnum",
    "LandClassificationEnum",
    "TenureTypes",
    "TenureCategoryEnum",
    "RightsRestrictions",
    "RightTypeEnum",
    "RestrictionTypeEnum",
    "LandAuthorities",
    "AuthorityRoleEnum",
]
