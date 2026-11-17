"""Tokenisation, term matching, evidence ranking and near-duplicate detection driven by data."""

from mzizi_patterns.features.cells.engine import CellEngine
from mzizi_patterns.features.codes.codes import RecipeGap, build_code, disambiguate, slug
from mzizi_patterns.features.embed.hashing import Embedder, HashingEmbedder
from mzizi_patterns.features.lookup.index import KnownName, Match, NameIndex, normalise
from mzizi_patterns.features.terms.terms import load_dictionary, load_profile, load_term_list
from mzizi_patterns.features.vocabulary.vocabulary import Vocabulary
from mzizi_patterns.orchestrator import PatternOrchestrator, propose_columns
from mzizi_patterns.shared.contracts import (
    CodePart,
    CodeRecipe,
    ColumnCandidate,
    ColumnProbe,
    ColumnProposal,
    Dictionary,
    DocumentScore,
    DocumentText,
    DuplicatePair,
    Impact,
    Profile,
    TableSpec,
    TagRule,
    TermEntry,
    TermGroup,
    TermList,
)

__all__ = [
    "CellEngine",
    "CodePart",
    "CodeRecipe",
    "ColumnCandidate",
    "ColumnProbe",
    "ColumnProposal",
    "Dictionary",
    "DocumentScore",
    "DocumentText",
    "DuplicatePair",
    "Embedder",
    "HashingEmbedder",
    "Impact",
    "KnownName",
    "Match",
    "NameIndex",
    "PatternOrchestrator",
    "Profile",
    "RecipeGap",
    "TableSpec",
    "TagRule",
    "TermEntry",
    "TermGroup",
    "TermList",
    "Vocabulary",
    "build_code",
    "disambiguate",
    "load_dictionary",
    "load_profile",
    "load_term_list",
    "normalise",
    "propose_columns",
    "slug",
]
