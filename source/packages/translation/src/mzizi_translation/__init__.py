"""Translation capability: tiered, engine-neutral translation of stored text behind one orchestrator.

Tiers, in order of trust: curated sources, a term glossary, then machine engines. The engine supplies the `TextStore`
(reads pending text, writes drafts) and the engines to use. This package never knows a database, a language or a model.
"""

from mzizi_translation.features.engines.ctranslate2 import CTranslate2Engine
from mzizi_translation.features.engines.http import HttpEngine
from mzizi_translation.features.engines.lookup import LookupEngine
from mzizi_translation.features.engines.ports import ProvenanceSink, TextStore, TranslationEngine
from mzizi_translation.features.glossary.glossary import Glossary, GlossaryEntry, build_glossary
from mzizi_translation.features.markers.engine import Marker, MarkerEngine, MarkerRules
from mzizi_translation.orchestrator.translation_orchestrator import TranslationOrchestrator
from mzizi_translation.shared.contracts import Draft, Flag, Pair, RunOptions, RunReport, TextUnit, Tier

__all__ = [
    "CTranslate2Engine", "Draft", "Flag", "Glossary", "GlossaryEntry", "HttpEngine", "LookupEngine", "Marker", "MarkerEngine", "MarkerRules", "Pair", "ProvenanceSink", "RunOptions",
    "RunReport", "TextStore", "TextUnit", "Tier", "TranslationEngine", "TranslationOrchestrator", "build_glossary",
]  # fmt: skip
