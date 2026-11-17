"""Tokenisation, term matching, evidence ranking and near-duplicate detection driven by data."""

from mzizi_patterns.features.cells.engine import CellEngine
from mzizi_patterns.features.terms.terms import load_dictionary, load_profile, load_term_list
from mzizi_patterns.features.vocabulary.vocabulary import Vocabulary
from mzizi_patterns.orchestrator import PatternOrchestrator, propose_columns
from mzizi_patterns.shared.contracts import (
    ColumnCandidate,
    ColumnProbe,
    ColumnProposal,
    Dictionary,
    DocumentScore,
    DocumentText,
    DuplicatePair,
    Impact,
    Profile,
    TagRule,
    TermEntry,
    TermGroup,
    TermList,
)

__all__ = [
    "CellEngine",
    "ColumnCandidate",
    "ColumnProbe",
    "ColumnProposal",
    "Dictionary",
    "DocumentScore",
    "DocumentText",
    "DuplicatePair",
    "Impact",
    "PatternOrchestrator",
    "Profile",
    "TagRule",
    "TermEntry",
    "TermGroup",
    "TermList",
    "Vocabulary",
    "load_dictionary",
    "load_profile",
    "load_term_list",
    "propose_columns",
]
