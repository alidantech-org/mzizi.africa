"""Run the patterns, heading rules and splits of term lists on cell and heading text, and check their own examples."""

from __future__ import annotations

from mzizi_patterns.features.cells.matcher import GroupLookup, Phrases, match_sequences
from mzizi_patterns.features.terms.terms import MergedGroup, merge_groups, resolve
from mzizi_patterns.features.tokenise.tokenise import words
from mzizi_patterns.shared.contracts import HeadingRule, Pattern, TermList


class CellEngine:
    def __init__(self, term_lists: tuple[TermList, ...]) -> None:
        self.by_code = {term_list.code: term_list for term_list in term_lists}
        self._merged: dict[str, dict[str, MergedGroup]] = {}

    def groups_of(self, code: str) -> dict[str, MergedGroup]:
        if code not in self._merged:
            self._merged[code] = merge_groups(resolve((code,), self.by_code))
        return self._merged[code]

    def lookup_for(self, code: str) -> GroupLookup:
        def lookup(ref: str) -> Phrases:
            owner, _, key = ref.rpartition("#")
            # a group of a list this one extends is read as this list sees it, so Kenyan additions count
            inherited = {found.code for found in resolve((code,), self.by_code)}
            group = self.groups_of(code if not owner or owner in inherited else owner).get(key)
            if group is None:
                raise KeyError(f"{code}: no group {ref!r}")
            phrases = {tuple(words(form)) for form in sorted(f for forms in group.surfaces.values() for f in forms)}
            return [list(p) for p in sorted((p for p in phrases if p), key=lambda p: (-len(p), p))]

        return lookup

    def find(self, code: str, ref: str, kind: str) -> tuple[str, Pattern | HeadingRule]:
        owner, _, key = ref.rpartition("#")
        owner = owner or code
        for found in resolve((owner,), self.by_code):
            items = found.patterns if kind == "pattern" else found.heading_rules
            for item in items:
                if (item.pattern if isinstance(item, Pattern) else item.rule) == key:
                    return found.code, item
        raise KeyError(f"{code}: no {kind} {ref!r}")

    def match(self, code: str, ref: str, text: str, kind: str = "pattern") -> dict[str, str] | None:
        _, item = self.find(code, ref, kind)
        return match_sequences(
            text, item.sequences, self.lookup_for(code)
        )  # in the caller's context: Kenyan words count

    def check_examples(self) -> list[str]:
        """Every example must match and capture what it says; every counterexample must not match."""
        problems: list[str] = []
        for code, term_list in sorted(self.by_code.items()):
            lookup = self.lookup_for(code)
            items: list[tuple[str, Pattern | HeadingRule]] = [(p.pattern, p) for p in term_list.patterns]
            items += [(r.rule, r) for r in term_list.heading_rules]
            for key, item in items:
                for example in item.examples:
                    got = match_sequences(example.text, item.sequences, lookup)
                    if got is None:
                        problems.append(f"{code}#{key}: example {example.text!r} does not match")
                        continue
                    for name, want in example.captures.items():
                        if got.get(name) != want:
                            problems.append(
                                f"{code}#{key}: example {example.text!r}: {name} is {got.get(name)!r}, expected {want!r}"
                            )
                for text in item.counterexamples:
                    if match_sequences(text, item.sequences, lookup) is not None:
                        problems.append(f"{code}#{key}: counterexample {text!r} matches")
        return problems
