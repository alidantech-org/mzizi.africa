"""Runtime operations for the translation package: reads pending text from PostgreSQL, translates, optionally writes back.

`translation.plan` lists what is waiting, `translation.glossary` builds a glossary from translations that exist, and
`translation.run` translates (a dry run unless `apply` is true). Engines are chosen per request and may be mixed: lookup
tables (curated sources), a local CTranslate2 model, or a web service. Secrets are never in a request: a service's key is
read from the environment variable the request names.
"""

from __future__ import annotations

import json
import os
from typing import Annotated, Literal

from pydantic import Field, TypeAdapter

from mzizi_engine.config import EngineConfig
from mzizi_engine.persistence.postgres.connection import connect
from mzizi_engine.persistence.postgres.translation import LedgerProvenance, PostgresTextStore
from mzizi_engine.runtime.assembly.specs import register_specs
from mzizi_engine.runtime.contracts.base import Frozen
from mzizi_engine.runtime.operations import OperationRegistry, Requirement, operation
from mzizi_translation import (
    CTranslate2Engine,
    Draft,
    Glossary,
    GlossaryEntry,
    HttpEngine,
    LookupEngine,
    MarkerEngine,
    MarkerRules,
    RunOptions,
    TextUnit,
    Tier,
    TranslationEngine,
    TranslationOrchestrator,
)

PACKAGE = "mzizi-translation"
VERSION = "0.1.0"
SAMPLE = 20


class LookupSpec(Frozen):
    kind: Literal["lookup"]
    name: str
    version: str
    tier: Literal["curated", "glossary"]
    #: A JSON file under the input root: {"source text": "translation"}.
    path: str


class MarkersSpec(Frozen):
    kind: Literal["markers"]
    name: str
    version: str
    #: A JSON file under the input root holding `MarkerRules` (phrases, heads and markers for one language pair).
    path: str


class CTranslate2Spec(Frozen):
    kind: Literal["ctranslate2"]
    name: str
    version: str
    model_dir: str
    tokenizer_path: str
    #: Language identity code -> the code the model uses (for example ref.lng.xx -> a model's language tag).
    codes: dict[str, str]


class HttpSpec(Frozen):
    kind: Literal["http"]
    name: str
    url: str
    dialect: Literal["libretranslate", "google-v2"]
    codes: dict[str, str]
    #: Name of the environment variable holding the service key; empty for a service without one.
    key_env: str = ""


EngineSpec = Annotated[LookupSpec | MarkersSpec | CTranslate2Spec | HttpSpec, Field(discriminator="kind")]


class StreamRequest(Frozen):
    stream: str
    source_language: str
    target_language: str
    limit: int = Field(default=50, gt=0)


class GlossaryRequest(StreamRequest):
    limit: int = Field(default=5000, gt=0)
    max_words: int = Field(gt=0)
    min_count: int = Field(default=1, gt=0)


class RunRequest(StreamRequest):
    engines: tuple[EngineSpec, ...] = ()
    #: Streams whose existing translations build the glossary for this run.
    glossary_from: tuple[str, ...] = ()
    glossary_max_words: int = Field(default=3, gt=0)
    tiers: tuple[Tier, ...] = (Tier.CURATED, Tier.GLOSSARY, Tier.MACHINE)
    batch_size: int = Field(default=16, gt=0)
    back_check_threshold: float = Field(default=0.0, ge=0.0, le=1.0)
    apply: bool = False
    #: A JSON-lines file under the input root that receives where each saved draft came from (only when `apply` is true).
    ledger: str = ""


class PlanResult(Frozen):
    stream: str
    waiting: tuple[TextUnit, ...]


class GlossaryResult(Frozen):
    stream: str
    glossary: Glossary


class RunResult(Frozen):
    stream: str
    applied: bool
    pending: int
    saved: int
    by_tier: dict[str, int]
    flagged: int
    untranslated: int
    #: Drafts with a quality flag first, then others, at most `SAMPLE`.
    sample: tuple[Draft, ...]


def _engines(
    specs: tuple[LookupSpec | MarkersSpec | CTranslate2Spec | HttpSpec, ...],
    request: StreamRequest,
    config: EngineConfig,
) -> list[TranslationEngine]:
    out: list[TranslationEngine] = []
    for spec in specs:
        if isinstance(spec, LookupSpec):
            root = config.require_input_root()
            path = (root / spec.path).resolve()
            if root not in path.parents:
                raise ValueError("lookup path escapes the engine input root")
            table = TypeAdapter(dict[str, str]).validate_python(json.loads(path.read_text(encoding="utf-8")))
            out.append(
                LookupEngine(
                    spec.name, spec.version, Tier(spec.tier), request.source_language, request.target_language, table
                )
            )
        elif isinstance(spec, MarkersSpec):
            root = config.require_input_root()
            path = (root / spec.path).resolve()
            if root not in path.parents:
                raise ValueError("markers path escapes the engine input root")
            out.append(
                MarkerEngine(spec.name, spec.version, MarkerRules.model_validate_json(path.read_text(encoding="utf-8")))
            )
        elif isinstance(spec, CTranslate2Spec):
            out.append(CTranslate2Engine(spec.name, spec.version, spec.model_dir, spec.tokenizer_path, spec.codes))
        else:
            out.append(
                HttpEngine(
                    spec.name,
                    spec.url,
                    spec.dialect,
                    spec.codes,
                    os.environ.get(spec.key_env, "") if spec.key_env else "",
                )
            )
    return out


def plan(request: StreamRequest) -> PlanResult:
    with connect(EngineConfig.load().require_postgres().url) as conn:
        orchestrator = TranslationOrchestrator(PostgresTextStore(conn), [])
        return PlanResult(
            stream=request.stream,
            waiting=tuple(
                orchestrator.pending(request.stream, request.source_language, request.target_language, request.limit)
            ),
        )


def glossary(request: GlossaryRequest) -> GlossaryResult:
    with connect(EngineConfig.load().require_postgres().url) as conn:
        orchestrator = TranslationOrchestrator(PostgresTextStore(conn), [])
        built = orchestrator.glossary(
            request.stream,
            request.source_language,
            request.target_language,
            limit=request.limit,
            max_words=request.max_words,
            min_count=request.min_count,
        )
        return GlossaryResult(stream=request.stream, glossary=built)


def run(request: RunRequest) -> RunResult:
    config = EngineConfig.load()
    with connect(config.require_postgres().url) as conn:
        store = PostgresTextStore(conn)
        ledger = None
        if request.ledger:
            root = config.require_input_root()
            target = (root / request.ledger).resolve()
            if root not in target.parents:
                raise ValueError("ledger path escapes the engine input root")
            ledger = LedgerProvenance(target)
        orchestrator = TranslationOrchestrator(store, _engines(request.engines, request, config), ledger)
        terms = Glossary()
        if request.glossary_from and Tier.GLOSSARY in request.tiers:
            entries: list[GlossaryEntry] = []
            for stream in request.glossary_from:
                entries += orchestrator.glossary(
                    stream,
                    request.source_language,
                    request.target_language,
                    limit=5000,
                    max_words=request.glossary_max_words,
                ).entries
            terms = Glossary(entries=tuple(entries), longest_term=request.glossary_max_words)
        options = RunOptions(
            source_language=request.source_language,
            target_language=request.target_language,
            limit=request.limit,
            tiers=request.tiers,
            batch_size=request.batch_size,
            back_check_threshold=request.back_check_threshold,
        )
        report = orchestrator.run(request.stream, options, glossary=terms, apply=request.apply)
    ordered = sorted(report.drafts, key=lambda d: (not d.flags, d.key))
    return RunResult(
        stream=report.stream,
        applied=report.applied,
        pending=report.pending,
        saved=report.saved,
        by_tier={t.value: report.count(t) for t in Tier},
        flagged=len(report.flagged()),
        untranslated=len(report.untranslated),
        sample=tuple(ordered[:SAMPLE]),
    )


def register_translation(registry: OperationRegistry) -> None:
    postgres = frozenset({Requirement.POSTGRES})
    register_specs(
        registry,
        (
            operation(
                "translation.plan",
                "List stored text waiting for a translation in a stream",
                StreamRequest,
                plan,
                1,
                requires=postgres,
            ),
            operation(
                "translation.glossary",
                "Build a term glossary from translations that already exist",
                GlossaryRequest,
                glossary,
                1,
                requires=postgres,
            ),
            operation(
                "translation.run",
                "Translate a stream's waiting text with curated sources, a glossary and machine engines; writes only when apply is true",
                RunRequest,
                run,
                1,
                requires=postgres,
            ),
        ),
        PACKAGE,
        VERSION,
    )
