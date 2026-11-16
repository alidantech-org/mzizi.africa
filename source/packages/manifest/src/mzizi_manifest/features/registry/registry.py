"""The cross-reference registry: every manifest code in a tree, and the checks that each reference resolves.

A source, mapping, vocabulary or extraction file declares a dotted `code`. Another manifest names it in `uses`, `extends` or
a module's `mapping`. This module only answers "does that code exist, is it the right kind, and may this manifest see it?":

- a code is unique across the tree;
- the first segment of a code is its scope: `global` or a country code such as `ke`;
- a manifest may use items in its own scope or in `global`, never in another country, and `global` never uses a country;
- a reference to a code of the wrong kind is an error;
- a reference cycle (for example one website extending another that extends it back) is an error.

Reading the files is in `scan.py`; nothing here touches the file system.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from enum import StrEnum
from pathlib import Path

GLOBAL_SCOPE = "global"
SCOPE = re.compile(r"^(global|[a-z]{2,3})$")


class Kind(StrEnum):
    SOURCE = "source"
    MAPPING = "mapping"
    VOCABULARY = "vocabulary"
    EXTRACTION = "extraction"


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


def check(registry: Registry) -> list[str]:
    """Every problem in the registry; each names the file, the field and the code."""
    problems: list[str] = []
    for code, entry in sorted(registry.entries.items()):
        where = str(entry.path)
        if not SCOPE.match(scope_of(code)):
            problems.append(f"{where}: code {code!r} must start with a scope: 'global' or a country code")
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
