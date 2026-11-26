"""Runtime operations for pattern generation: `template.generate` runs a pattern, `template.coverage` lists what is still missing.

The generation itself is a database function (see `persistence/postgres/template.py`); these operations are the engine's
front door to it. Generation creates structure only (institutions, offices, terms, holder slots, contests, premises and
contact slots); it never creates a person, a result or any evidence. A second run creates nothing.
"""

from __future__ import annotations

from pydantic import Field

from mzizi_engine.config import EngineConfig
from mzizi_engine.persistence.postgres.connection import connect
from mzizi_engine.persistence.postgres.template import CoverageRow, PostgresTemplates
from mzizi_engine.runtime.assembly.specs import register_specs
from mzizi_engine.runtime.contracts.base import Frozen
from mzizi_engine.runtime.operations import OperationRegistry, Requirement, operation

PACKAGE = "mzizi-template"
VERSION = "0.1.0"


class GenerateRequest(Frozen):
    #: The pattern's code, for example `tpl.pat.ke.county-government`; a country or source is data, never named here.
    patterns: tuple[str, ...] = Field(min_length=1)


class GenerateResult(Frozen):
    #: Rows created per pattern, in the order they ran.
    created: dict[str, int]


class CoverageRequest(Frozen):
    #: One queue (`holder`, `contact`, `geometry`, `office`, `term`, `contest`), or empty for all of them.
    queue: str = ""
    limit: int = Field(default=1000, gt=0)


class CoverageResult(Frozen):
    counts: dict[str, int]
    rows: tuple[CoverageRow, ...]


def generate(request: GenerateRequest) -> GenerateResult:
    with connect(EngineConfig.load().require_postgres().url) as conn:
        output = PostgresTemplates(conn).generate(request.patterns)
        conn.commit()
    return GenerateResult(created={item.pattern: item.created for item in output.results})


def coverage(request: CoverageRequest) -> CoverageResult:
    with connect(EngineConfig.load().require_postgres().url) as conn:
        templates = PostgresTemplates(conn)
        return CoverageResult(counts=templates.counts(), rows=templates.pending(request.queue, request.limit))


def register_template(registry: OperationRegistry) -> None:
    postgres = frozenset({Requirement.POSTGRES})
    register_specs(
        registry,
        (
            operation(
                "template.generate",
                "Run patterns in order: create the institutions, offices, terms, holder slots, contests, premises and contact slots they describe; a repeat run creates nothing",
                GenerateRequest,
                generate,
                1,
                requires=postgres,
            ),
            operation(
                "template.coverage",
                "List the pending slots and gaps (holders without a person, contacts without a value, geometries without a drawing, contests without candidates)",
                CoverageRequest,
                coverage,
                1,
                requires=postgres,
            ),
        ),
        PACKAGE,
        VERSION,
    )
