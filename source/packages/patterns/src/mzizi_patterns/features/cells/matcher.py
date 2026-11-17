"""Match a token sequence against a pattern's ordered parts, with bounded backtracking.

No regular expressions: parts are word groups, literals, digit runs, letter runs, punctuation and numbers, so a pattern
written in data cannot hide a catastrophic expression. A step budget stops anything unexpectedly slow."""

from __future__ import annotations

from collections.abc import Callable, Iterator
from dataclasses import dataclass, field

from mzizi_patterns.features.cells.tokens import NUM, PUNCT, WORD, Token, tokenise
from mzizi_patterns.features.tokenise.tokenise import words
from mzizi_patterns.shared.contracts import Part

MAX_STEPS = 50_000
type Phrases = list[list[str]]  # each phrase is its words, case folded; longest first
type GroupLookup = Callable[[str], Phrases]


class Budget:
    def __init__(self) -> None:
        self.left = MAX_STEPS

    def spend(self) -> bool:
        self.left -= 1
        return self.left > 0


@dataclass
class State:
    tokens: list[Token]
    lookup: GroupLookup
    budget: Budget = field(default_factory=Budget)


def _case_ok(text: str, case: str) -> bool:
    match case:
        case "capitalised":
            return text[:1].isupper()
        case "upper":
            return text.isupper()
        case "lower":
            return text.islower()
        case _:
            return True


def _group_ends(state: State, pos: int, ref: str) -> Iterator[int]:
    """End positions after a phrase of the group, skipping full stops inside it and one after it (P.O. Box, Hon.)."""
    tokens = state.tokens
    for phrase in state.lookup(ref):
        i, k = pos, 0
        while k < len(phrase) and i < len(tokens):
            token = tokens[i]
            if token.kind == PUNCT and token.text == "." and k > 0:
                i += 1
                continue
            if token.kind in (WORD, NUM) and token.folded == phrase[k]:
                k += 1
                i += 1
            else:
                break
        if k == len(phrase):
            if i < len(tokens) and tokens[i].kind == PUNCT and tokens[i].text == ".":
                yield i + 1
            yield i


def _number_ends(tokens: list[Token], pos: int) -> Iterator[int]:
    """1 | 1,200 | 1,200,000.50 | 88 834: digit groups with thousands marks, then optional decimals; longest first."""
    if pos >= len(tokens) or tokens[pos].kind != NUM:
        return
    ends = [pos + 1]
    i = pos + 1
    while (
        i + 1 < len(tokens)
        and tokens[i].kind == PUNCT
        and tokens[i].text == ","
        and tokens[i + 1].kind == NUM
        and len(tokens[i + 1].text) == 3
    ):
        i += 2
        ends.append(i)
    if (
        i + 1 < len(tokens)
        and tokens[i].kind == PUNCT
        and tokens[i].text == "."
        and tokens[i + 1].kind == NUM
        and len(tokens[i + 1].text) <= 2
    ):
        ends.append(i + 2)
    yield from reversed(ends)


def _single_ends(state: State, pos: int, part: Part) -> Iterator[int]:
    tokens = state.tokens
    if not state.budget.spend():
        return
    if part.group:
        yield from _group_ends(state, pos, part.group)
    elif part.literal:
        want = words(part.literal)
        got = [t.folded for t in tokens[pos : pos + len(want)]]
        if want and got == want:
            yield pos + len(want)
    elif part.words:
        if pos < len(tokens) and tokens[pos].kind == WORD and _case_ok(tokens[pos].text, part.words):
            yield pos + 1
    elif part.digits is not None:
        if (
            pos < len(tokens)
            and tokens[pos].kind == NUM
            and part.digits.min <= len(tokens[pos].text) <= part.digits.max
        ):
            yield pos + 1
    elif part.letters is not None:
        span = part.letters
        if (
            pos < len(tokens)
            and tokens[pos].kind == WORD
            and span.min <= len(tokens[pos].text) <= span.max
            and _case_ok(tokens[pos].text, span.case)
        ):
            yield pos + 1
    elif part.punct:
        if pos < len(tokens) and tokens[pos].kind == PUNCT and tokens[pos].text in part.punct:
            yield pos + 1
    elif part.number:
        yield from _number_ends(tokens, pos)
    elif part.any_of:
        for option in part.any_of:
            yield from _single_ends(state, pos, option)


def _part_ends(state: State, pos: int, part: Part) -> Iterator[int]:
    """All positions the part can end at, preferring to take more."""
    low, high = (part.repeat.min, part.repeat.max) if part.repeat else (1, 1)
    if part.optional:
        low = 0
    frontier = {pos}
    layers: list[set[int]] = [{pos}]
    for _ in range(high):
        nxt: set[int] = set()
        for start in frontier:
            nxt.update(_single_ends(state, start, part))
        if not nxt:
            break
        layers.append(nxt)
        frontier = nxt
    seen: set[int] = set()
    counts = range(low, len(layers)) if part.lazy else range(len(layers) - 1, low - 1, -1)
    for count in counts:
        if count < 0:
            continue
        for end in sorted(layers[count], reverse=not part.lazy):
            if end not in seen:
                seen.add(end)
                yield end


def _walk(
    state: State, parts: tuple[Part, ...], index: int, pos: int, spans: list[tuple[str, int, int]]
) -> list[tuple[str, int, int]] | None:
    if not state.budget.spend():
        return None
    if index == len(parts):
        return spans if pos == len(state.tokens) else None
    part = parts[index]
    for end in _part_ends(state, pos, part):
        taken = [(part.as_, pos, end)] if part.as_ and end > pos else []
        found = _walk(state, parts, index + 1, end, [*spans, *taken])
        if found is not None:
            return found
    return None


def match_sequences(text: str, sequences: tuple[tuple[Part, ...], ...], lookup: GroupLookup) -> dict[str, str] | None:
    """The captures of the first sequence that matches the whole text, or None."""
    tokens = tokenise(text)
    if not tokens:
        return None
    state = State(tokens, lookup)
    for sequence in sequences:
        spans = _walk(state, sequence, 0, 0, [])
        if spans is not None:
            captures: dict[str, list[str]] = {}
            for name, start, end in spans:
                captures.setdefault(name, []).append(text[tokens[start].start : tokens[end - 1].end])
            return {name: "".join(pieces) if len(pieces) > 1 else pieces[0] for name, pieces in captures.items()}
    return None
