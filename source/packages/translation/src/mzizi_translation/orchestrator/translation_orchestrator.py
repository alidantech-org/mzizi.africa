"""TranslationOrchestrator: everything translation can do, behind one class with typed inputs and outputs.

The engine builds it with a `TextStore` (which reads pending text and writes drafts) and the translation engines to use, in
any mix: lookup tables, local models, web services. Which streams exist, which languages and which engines a stream may use
are the caller's decisions. Nothing here knows a database, a language or a model.
"""

from __future__ import annotations

from collections.abc import Sequence

from mzizi_translation.features.engines.ports import ProvenanceSink, TextStore, TranslationEngine
from mzizi_translation.features.glossary.glossary import Glossary, build_glossary
from mzizi_translation.features.pipeline.run import run_stream
from mzizi_translation.shared.contracts import RunOptions, RunReport, TextUnit


class TranslationOrchestrator:
    def __init__(
        self, store: TextStore, engines: Sequence[TranslationEngine], provenance: ProvenanceSink | None = None
    ) -> None:
        self._store, self._engines, self._provenance = store, tuple(engines), provenance

    def pending(self, stream: str, source_language: str, target_language: str, limit: int) -> list[TextUnit]:
        return self._store.pending(stream, source_language, target_language, limit)

    def glossary(
        self, stream: str, source_language: str, target_language: str, *, limit: int, max_words: int, min_count: int = 1
    ) -> Glossary:
        return build_glossary(
            self._store.pairs(stream, source_language, target_language, limit), max_words=max_words, min_count=min_count
        )

    def run(
        self, stream: str, options: RunOptions, *, glossary: Glossary | None = None, apply: bool = False
    ) -> RunReport:
        """Translate pending texts of a stream. Nothing is written unless `apply` is true."""
        return run_stream(
            self._store, self._engines, glossary, stream, options, apply=apply, provenance=self._provenance
        )
