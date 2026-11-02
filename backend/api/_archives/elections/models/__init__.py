"""
Elections domain models - electoral events, seats, candidates, and results.
Clean, minimal, and fully traceable electoral system with governance integration.
"""

from .elections import Elections, ElectionTypeEnum
from .seats import Seats
from .candidates import Candidates
from .results import Results

__all__ = [
    "Elections",
    "ElectionTypeEnum",
    "Seats",
    "Candidates", 
    "Results",
]
