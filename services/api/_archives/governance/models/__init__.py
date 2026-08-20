"""
Governance domain models - government offices, authority, hierarchy, and office holders.
Full legal traceability with strict appointment type enforcement and physical location tracking.
"""

from .offices import (
    Offices,
    OfficeTypeEnum,
    AppointmentTypeEnum,
    LegalClassificationEnum,
)
from .office_authority import OfficeAuthority
from .office_hierarchy import OfficeHierarchy
from .office_holders import OfficeHolders
from .office_locations import OfficeLocations

__all__ = [
    "Offices",
    "OfficeTypeEnum",
    "AppointmentTypeEnum",
    "LegalClassificationEnum",
    "OfficeAuthority",
    "OfficeHierarchy",
    "OfficeHolders",
    "OfficeLocations",
]
