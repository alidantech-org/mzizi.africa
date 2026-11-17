"""Tokenisation, term matching, evidence ranking and near-duplicate detection driven by data."""

from mzizi_patterns.features.terms.terms import load_profile, load_term_list
from mzizi_patterns.orchestrator import PatternOrchestrator
from mzizi_patterns.shared.contracts import (
    DocumentScore,
    DocumentText,
    DuplicatePair,
    Impact,
    Profile,
    TagRule,
    TermEntry,
    TermList,
)

__all__ = [
    "DocumentScore",
    "DocumentText",
    "DuplicatePair",
    "Impact",
    "PatternOrchestrator",
    "Profile",
    "TagRule",
    "TermEntry",
    "TermList",
    "load_profile",
    "load_term_list",
]
