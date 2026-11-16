"""The cross-reference registry: every manifest code in a tree, and the checks that each reference resolves.

A source, mapping, term list or extraction file declares a dotted `code`. Another manifest names it in `uses`, `extends` or
a module's `mapping`. This module only answers "does that code exist, is it the right kind, and may this manifest see it?":

- a code is unique across the tree;
- the first segment of a code is its scope: `global` or a country code such as `ke`;
- a manifest may use items in its own scope or in `global`, never in another country, and `global` never uses a country;
- a reference to a code of the wrong kind is an error;
- a reference cycle (for example one website extending another that extends it back) is an error;
- a job spec is `<scope>.engine.jobs.<name>`;
- the second segment is an area: a database group (the third segment is then one of its tables) or a system area;
- a source is `<scope>.source.<websites|apis>.<name>` and its kind agrees; an extraction expectation is in `extraction`;
- a mapping is named after the table it writes first: `<scope>.<schema>.<table>.<name>`.

Reading the files is in `scan.py`; nothing here touches the file system.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from enum import StrEnum
from pathlib import Path

from mzizi_manifest.features.registry.areas import Areas

GLOBAL_SCOPE = "global"
SCOPE = re.compile(r"^(global|[a-z]{2,3})$")


class Kind(StrEnum):
    SOURCE = "source"
    MAPPING = "mapping"
    TERMS = "terms"
    EXTRACTION = "extraction"
    JOB = "job"


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


def scope_of(code: str) -> str:
    """The scope of a code is its first dotted segment."""
    return code.split(".", 1)[0]


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
        entry = registry.entries[code]
        for reference in entry.references:
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


SOURCE_TABLES = {"website": "websites", "api": "apis"}


def code_problems(entry: Entry, areas: Areas) -> list[str]:
    """Check a code against the contracts: its area, its table and what its kind requires."""
    where, segments = str(entry.path), entry.code.split(".")
    if not SCOPE.match(segments[0]):
        return [f"{where}: code {entry.code!r} must start with a scope: 'global' or a country code"]
    if len(segments) < 3:
        return [f"{where}: code {entry.code!r} needs at least <scope>.<area>.<name>"]
    area = segments[1]
    problems: list[str] = []
    if area in areas.tables:
        if len(segments) < 4 or segments[2] not in areas.tables[area]:
            problems.append(
                f"{where}: code {entry.code!r}: {segments[2]!r} is not a table of {area!r} "
                f"(expected <scope>.{area}.<table>.<name>)"
            )
    elif area not in areas.system:
        allowed = sorted((*areas.tables, *areas.system))
        problems.append(
            f"{where}: code {entry.code!r}: {area!r} is not a database group or system area ({', '.join(allowed)})"
        )
    if entry.kind is Kind.SOURCE:
        table = SOURCE_TABLES.get(entry.detail or "")
        if area != "source" or (table and segments[2:3] != [table]):
            problems.append(
                f"{where}: a {entry.detail} source code must be <scope>.source.{table}.<name>, not {entry.code!r}"
            )
    elif entry.kind is Kind.JOB and area != "engine":
        problems.append(f"{where}: a job spec code must be <scope>.engine.jobs.<name>, not {entry.code!r}")
    elif entry.kind is Kind.EXTRACTION and area != "extraction":
        problems.append(
            f"{where}: an extraction expectation code must be <scope>.extraction.<name>, not {entry.code!r}"
        )
    elif entry.kind is Kind.MAPPING and entry.detail and ".".join(segments[1:3]) != entry.detail:
        problems.append(
            f"{where}: a mapping is named after the table it writes first ({entry.detail}); "
            f"code {entry.code!r} should be <scope>.{entry.detail}.<name>"
        )
    return problems


def check(registry: Registry, areas: Areas) -> list[str]:
    """Every problem in the registry; each names the file, the field and the code."""
    problems: list[str] = []
    for code, entry in sorted(registry.entries.items()):
        where = str(entry.path)
        problems += code_problems(entry, areas)
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
            if not can_see(scope_of(code), scope_of(reference.code)):
                problems.append(
                    f"{where}: {reference.field}: {reference.code!r} is in scope {scope_of(reference.code)!r}, "
                    f"which {code!r} (scope {scope_of(code)!r}) may not use"
                )
    if cycle := _cycle(registry):
        problems.append(f"reference cycle: {' -> '.join(cycle)}")
    return problems
