"""Load term lists, merge their groups, and index phrases for exact, token-aligned lookup."""

from __future__ import annotations

from pathlib import Path

import yaml

from mzizi_patterns.features.tokenise.tokenise import words
from mzizi_patterns.shared.contracts import Axis, Dictionary, Profile, Role, TermGroup, TermList

type Phrase = tuple[str, ...]


def load_term_list(path: Path) -> TermList:
    return TermList.model_validate(yaml.safe_load(path.read_text(encoding="utf-8")), strict=False)


def load_dictionary(path: Path) -> Dictionary:
    return Dictionary.model_validate(yaml.safe_load(path.read_text(encoding="utf-8")), strict=False)


def load_profile(path: Path) -> Profile:
    return Profile.model_validate(yaml.safe_load(path.read_text(encoding="utf-8")), strict=False)


class MergedGroup:
    """The same-named groups of every loaded list: terms by canonical value, each with every surface form."""

    def __init__(self, name: str) -> None:
        self.name = name
        self.label = ""
        self.role: Role | None = None
        self.surfaces: dict[str, set[str]] = {}
        self.represents: dict[str, str] = {}
        self.kind_words = False

    def add(self, group: TermGroup) -> None:
        self.label = self.label or group.label
        self.role = self.role or group.role
        self.kind_words = self.kind_words or group.kind_words
        for entry in group.terms:
            forms = self.surfaces.setdefault(entry.value, {entry.value})
            forms.update(alias.value for alias in entry.aliases)
            if entry.represents:
                self.represents[entry.value] = entry.represents

    @property
    def axis(self) -> Axis:
        return Axis.SUBJECT if self.role is Role.SUBJECT else Axis.KIND


def resolve(codes: tuple[str, ...], by_code: dict[str, TermList]) -> tuple[TermList, ...]:
    """The named lists and everything they extend, parents before children, each once."""
    ordered: list[TermList] = []
    seen: set[str] = set()

    def visit(code: str, trail: tuple[str, ...]) -> None:
        if code in seen:
            return
        if code in trail:
            raise ValueError(f"term lists extend each other in a cycle: {' -> '.join((*trail, code))}")
        if code not in by_code:
            raise ValueError(f"term list {code} is not supplied")
        for parent in by_code[code].extends:
            visit(parent, (*trail, code))
        seen.add(code)
        ordered.append(by_code[code])

    for code in codes:
        visit(code, ())
    return tuple(ordered)


def merge_groups(lists: tuple[TermList, ...]) -> dict[str, MergedGroup]:
    merged: dict[str, MergedGroup] = {}
    for term_list in lists:
        for group in term_list.groups:
            merged.setdefault(group.group, MergedGroup(group.group)).add(group)
    return merged


def phrase_index(groups: list[MergedGroup]) -> dict[Phrase, str]:
    """Each phrase (a term or alias split into tokens) points to the canonical term it stands for."""
    index: dict[Phrase, str] = {}
    for group in groups:
        for value, forms in group.surfaces.items():
            for surface in forms:
                phrase = tuple(words(surface))
                if phrase:
                    index.setdefault(phrase, value)
    return index
