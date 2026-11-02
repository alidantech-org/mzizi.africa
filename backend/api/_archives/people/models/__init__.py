"""
People domain models - core identity, status, identifiers, aliases, and citizenship.
Clean, secure, and temporal human layer for the entire system.
"""

from .people import People, GenderEnum
from .person_status import PersonStatus, StatusCodeEnum
from .person_identifiers import PersonIdentifiers, IdentifierTypeEnum
from .person_aliases import PersonAliases
from .person_citizenship import PersonCitizenship, CitizenshipTypeEnum

__all__ = [
    "People",
    "GenderEnum",
    "PersonStatus",
    "StatusCodeEnum",
    "PersonIdentifiers",
    "IdentifierTypeEnum",
    "PersonAliases",
    "PersonCitizenship",
    "CitizenshipTypeEnum",
]
