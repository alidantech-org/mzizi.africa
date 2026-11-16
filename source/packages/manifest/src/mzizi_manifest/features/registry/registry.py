"""The cross-reference registry: every manifest code in a tree, and the checks that each reference resolves.

A source, mapping, term list, job spec or piece of engine data declares a dotted `code`. Another manifest names it in `uses`,
`extends` or a module's `mapping`. This module answers "does that code exist, is it the right kind, may this manifest see it,
and does the code say what the thing is?":

- a code is well formed (`.docs/rules/codes.md`) and unique across the tree;
- a source is `pg.src.<sources short>.<scope>.<name>` and its kind agrees (a source is a database row, so `pg`);
- a mapping is `sys.map.<schema short>.<table short>.<scope>.<name>`, named after the table it writes first;
- a term list is `sys.trm.<schema short>.<table short>.<scope>.<name>` for a real table;
- a job spec is `sys.eng.job.<scope>.<name>`, other engine data `sys.eng.<name path>`;
- a manifest may use items in its own scope or in `global`, never in another country, and `global` never uses a country;
- a reference to a code of the wrong kind, or a reference cycle, is an error.

Reading the files is in `scan.py`; nothing here touches the file system.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from enum import StrEnum
from pathlib import Path

from mzizi_manifest.features.codes.glossary import Glossary
from mzizi_manifest.features.codes.grammar import segments_problem

GLOBAL_SCOPE = "global"
SCOPE = re.compile(r"^(global|[a-z]{2,3})$")
SOURCE_TABLES = {"website": "source.sources", "api": "source.sources"}


class Kind(StrEnum):
    SOURCE = "source"
    MAPPING = "mapping"
    TERMS = "terms"
    JOB = "job"
    #: Flat engine data and configuration, such as the web classification the fetch package reads.
    ENGINE = "engine"


@dataclass(frozen=True)
class Reference:
    """One use of another manifest's code, with where it was written."""

    field: str
    code: str
    expected: Kind


@dataclass(frozen=True)
class Entry:
    code: str
    kind: Kind
    path: Path
    references: tuple[Reference, ...]
    #: A source's `kind`, or the first table a mapping yields; what the code's own segments are checked against.
    detail: str | None = None


@dataclass(frozen=True)
class Registry:
    entries: dict[str, Entry]

    def resolve(self, code: str) -> Entry | None:
        return self.entries.get(code)

    def users_of(self, code: str) -> tuple[Entry, ...]:
        """Every entry that names this code."""
        return tuple(e for e in self.entries.values() if any(r.code == code for r in e.references))


def scope_of(entry: Entry) -> str:
    """The scope segment of a manifest code; engine data has no scope and counts as `global`."""
    segments = entry.code.split(".")
    index = {Kind.SOURCE: 3, Kind.MAPPING: 4, Kind.TERMS: 4, Kind.JOB: 3}.get(entry.kind)
    return segments[index] if index is not None and len(segments) > index else GLOBAL_SCOPE


def can_see(user_scope: str, target_scope: str) -> bool:
    """Own scope or `global`; a `global` manifest sees only `global`."""
    return target_scope in (user_scope, GLOBAL_SCOPE)


def _cycle(registry: Registry) -> list[str] | None:
    """The first cycle found in the reference graph, as a list of codes ending where it started."""
    state: dict[str, int] = {}  # 1 = on the current path, 2 = finished
    path: list[str] = []

    def visit(code: str) -> list[str] | None:
        state[code] = 1
        path.append(code)
        for reference in registry.entries[code].references:
            target = reference.code
            if target not in registry.entries:
                continue
            if state.get(target) == 1:
                return [*path[path.index(target) :], target]
            if state.get(target) is None and (found := visit(target)):
                return found
        path.pop()
        state[code] = 2
        return None

    for code in sorted(registry.entries):
        if state.get(code) is None and (found := visit(code)):
            return found
    return None


def code_problems(entry: Entry, glossary: Glossary) -> list[str]:
    """Check a code against the grammar, the glossary and what its kind requires."""
    where, code = str(entry.path), entry.code
    if reason := segments_problem(code):
        return [f"{where}: code {code!r} {reason}"]
    segments = code.split(".")
    problems: list[str] = []

    def expect(pattern: str, minimum: int) -> bool:
        if segments[:2] != pattern.split(".")[:2] or len(segments) < minimum:
            problems.append(f"{where}: code {code!r} must look like {pattern}")
            return False
        return True

    def scope_ok(index: int) -> None:
        if len(segments) > index and not SCOPE.match(segments[index]):
            problems.append(f"{where}: code {code!r}: {segments[index]!r} must be 'global' or a country code")

    if entry.kind is Kind.SOURCE:
        wanted = SOURCE_TABLES.get(entry.detail or "")
        if expect("pg.src.<table short>.<scope>.<name>", 5):
            table = glossary.table_for(segments[1], segments[2])
            if table is None or table.qualified_name != wanted:
                article = "an" if entry.detail == "api" else "a"
                problems.append(
                    f"{where}: {article} {entry.detail} source code must use the short of {wanted}, not {segments[2]!r}"
                )
            scope_ok(3)
    elif entry.kind in (Kind.MAPPING, Kind.TERMS):
        prefix = "sys.map" if entry.kind is Kind.MAPPING else "sys.trm"
        if expect(f"{prefix}.<schema short>.<table short>.<scope>.<name>", 6):
            table = glossary.table_for(segments[2], segments[3])
            if table is None:
                problems.append(f"{where}: code {code!r}: {segments[2]}.{segments[3]} is not a schema and table short")
            elif entry.kind is Kind.MAPPING and entry.detail and table.qualified_name != entry.detail:
                problems.append(
                    f"{where}: a mapping is named after the table it writes first ({entry.detail}); "
                    f"code {code!r} names {table.qualified_name}"
                )
            scope_ok(4)
    elif entry.kind is Kind.JOB:
        if expect("sys.eng.job.<scope>.<name>", 5) and segments[2] != "job":
            problems.append(f"{where}: a job spec code must be sys.eng.job.<scope>.<name>, not {code!r}")
        scope_ok(3)
    elif entry.kind is Kind.ENGINE and expect("sys.eng.<name path>", 3) and segments[2] == "job":
        problems.append(f"{where}: engine data code must not use the job path: {code!r}")
    return problems


def check(registry: Registry, glossary: Glossary) -> list[str]:
    """Every problem in the registry; each names the file, the field and the code."""
    problems: list[str] = []
    for _code, entry in sorted(registry.entries.items()):
        where = str(entry.path)
        problems += code_problems(entry, glossary)
        for reference in entry.references:
            target = registry.resolve(reference.code)
            if target is None:
                problems.append(f"{where}: {reference.field}: unknown {reference.expected} code {reference.code!r}")
                continue
            if target.kind != reference.expected:
                problems.append(
                    f"{where}: {reference.field}: {reference.code!r} is a {target.kind} (in {target.path}), "
                    f"not a {reference.expected}"
                )
            if not can_see(scope_of(entry), scope_of(target)):
                problems.append(
                    f"{where}: {reference.field}: {reference.code!r} is in scope {scope_of(target)!r}, "
                    f"which {entry.code!r} (scope {scope_of(entry)!r}) may not use"
                )
    if cycle := _cycle(registry):
        problems.append(f"reference cycle: {' -> '.join(cycle)}")
    return problems
