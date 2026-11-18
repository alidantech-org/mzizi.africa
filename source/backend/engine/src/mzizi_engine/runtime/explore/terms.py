"""Show the engine's term knowledge and tag text with it: which groups and canonical terms a piece of text mentions."""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic import BaseModel

from mzizi_engine.runtime.assembly.knowledge import load_vocabulary
from mzizi_patterns import Vocabulary
from mzizi_patterns.features.tokenise.tokenise import words

SCOPES = ("ke", "global")


class TermGroupInfo(BaseModel):
    domain: str
    group: str
    label: str
    terms: tuple[str, ...]


class TermHit(BaseModel):
    domain: str
    group: str
    term: str
    surface: str


class TaggedText(BaseModel):
    text: str
    hits: tuple[TermHit, ...]


@lru_cache(maxsize=1)
def _vocabulary(seed: Path) -> Vocabulary:
    return load_vocabulary(seed, SCOPES)


def groups(seed: Path) -> tuple[TermGroupInfo, ...]:
    vocabulary = _vocabulary(seed)
    return tuple(
        TermGroupInfo(domain=domain, group=group.name, label=group.label, terms=tuple(sorted(group.surfaces)))
        for (domain, _), group in sorted(vocabulary.groups.items())
    )


def tag(seed: Path, texts: list[str], domain: str = "") -> tuple[TaggedText, ...]:
    vocabulary = _vocabulary(seed)
    tagged: list[TaggedText] = []
    for text in texts:
        tokens = words(text)
        hits: list[TermHit] = []
        for (group_domain, _), group in vocabulary.groups.items():
            if domain and group_domain != domain:
                continue
            for canonical, forms in group.surfaces.items():
                for form in sorted(forms):
                    phrase = words(form)
                    if phrase and any(tokens[i : i + len(phrase)] == phrase for i in range(len(tokens))):
                        hits.append(TermHit(domain=group_domain, group=group.name, term=canonical, surface=form))
                        break
        tagged.append(TaggedText(text=text, hits=tuple(hits)))
    return tuple(tagged)
