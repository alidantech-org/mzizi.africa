"""The words, patterns and heading rules in force for a set of scopes, layered by domain.

A term list is `sys.trm.<scope>.<domain>`. For `scopes=("global", "ke")` the lists of one domain are layered: groups with
the same key merge across scopes (Kenyan wording joins the global group), and a pattern or rule of a narrower scope
replaces a wider one of the same key. A link `<list code>#<key>` names the domain of that list, so the same dictionary
serves any scope."""

from __future__ import annotations

from collections.abc import Mapping

from mzizi_patterns.features.cells.matcher import Phrases, match_sequences
from mzizi_patterns.features.terms.terms import MergedGroup
from mzizi_patterns.features.tokenise.tokenise import words
from mzizi_patterns.shared.contracts import HeadingRule, Pattern, Split, TermList

type Key = tuple[str, str]  # (domain, key)


def domain_of(code: str) -> str:
    return code.split(".")[3]


def scope_of(code: str) -> str:
    return code.split(".")[2]


class Vocabulary:
    def __init__(self, term_lists: tuple[TermList, ...], scopes: tuple[str, ...] = ("global",)) -> None:
        order = {scope: i for i, scope in enumerate(scopes)}
        chosen = sorted((t for t in term_lists if scope_of(t.code) in order), key=lambda t: order[scope_of(t.code)])
        self.groups: dict[Key, MergedGroup] = {}
        self.patterns: dict[Key, Pattern] = {}
        self.rules: dict[Key, HeadingRule] = {}
        self.splits: dict[Key, tuple[Split, str]] = {}
        for term_list in chosen:
            domain = domain_of(term_list.code)
            for group in term_list.groups:
                self.groups.setdefault((domain, group.group), MergedGroup(group.group)).add(group)
            for pattern in term_list.patterns:
                self.patterns[(domain, pattern.pattern)] = pattern
            for rule in term_list.heading_rules:
                self.rules[(domain, rule.rule)] = rule
            for split in term_list.splits:
                self.splits[(domain, split.split)] = (split, domain)

    def add_value_aliases(self, aliases: Mapping[str, tuple[str, ...]]) -> int:
        """Give every term that `represents` a reference value the labels that value carries (any language)."""
        added = 0
        for group in self.groups.values():
            for canonical, code in group.represents.items():
                for label in aliases.get(code, ()):
                    if label not in group.surfaces[canonical]:
                        group.surfaces[canonical].add(label)
                        added += 1
        return added

    def kind_filler(self) -> dict[str, str]:
        """Single words that only name a kind, with the kind code they point at ('' when they point at none)."""
        filler: dict[str, str] = {}
        for group in self.groups.values():
            if not group.kind_words:
                continue
            for canonical, forms in group.surfaces.items():
                kind = group.represents.get(canonical, "")
                for form in forms:
                    tokens = words(form)
                    if len(tokens) == 1:
                        filler.setdefault(tokens[0], kind)
        return filler

    def key(self, ref: str, domain: str) -> Key:
        owner, _, key = ref.rpartition("#")
        return (domain_of(owner) if owner else domain, key)

    def phrases(self, ref: str, domain: str) -> Phrases:
        group = self.groups.get(self.key(ref, domain))
        if group is None:
            raise KeyError(f"no group {ref!r} in domain {domain}")
        forms = {tuple(words(f)) for forms in group.surfaces.values() for f in forms}
        return [list(p) for p in sorted((p for p in forms if p), key=lambda p: (-len(p), p))]

    def surfaces(self, ref: str, domain: str) -> dict[str, str]:
        group = self.groups.get(self.key(ref, domain))
        return {form: canonical for canonical, forms in group.surfaces.items() for form in forms} if group else {}

    def match(self, ref: str, domain: str, text: str, heading: bool = False) -> dict[str, str] | None:
        key = self.key(ref, domain)
        item = (self.rules if heading else self.patterns).get(key)
        if item is None:
            return None
        return match_sequences(text, item.sequences, lambda r: self.phrases(r, key[0]))
