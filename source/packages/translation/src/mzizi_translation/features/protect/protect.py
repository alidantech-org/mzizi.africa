"""Keep numbers, designations, placeholders and glossary terms out of the machine's hands.

Before translation they are replaced by neutral tokens (`QX1Q`); afterwards the tokens are replaced by the original text or the
glossary target. A token the engine dropped is reported so the text can be retried unmasked. The scan reads characters; it
does not use regular expressions.
"""

from __future__ import annotations

from dataclasses import dataclass

from mzizi_patterns.features.tokenise.tokenise import normalise, words
from mzizi_translation.features.glossary.glossary import Glossary

TOKEN_OPEN, TOKEN_CLOSE = "QX", "Q"


@dataclass(frozen=True)
class Masked:
    text: str
    #: (token, text that replaces it after translation)
    replacements: tuple[tuple[str, str], ...]


def _alnum_runs(text: str) -> list[tuple[int, int]]:
    runs: list[tuple[int, int]] = []
    start = -1
    for i, ch in enumerate([*text, " "]):
        if ch.isalnum():
            start = i if start < 0 else start
        elif start >= 0:
            runs.append((start, i))
            start = -1
    return runs


def protected_spans(text: str) -> list[tuple[int, int]]:
    """Spans that must survive translation: words with digits (27, 4B, 2012), `(1)`, `(a)`, `{name}`, `%s`."""
    spans: list[tuple[int, int]] = []
    n = len(text)
    i = 0
    while i < n:
        ch = text[i]
        if ch in "({":
            close = ")" if ch == "(" else "}"
            j = text.find(close, i + 1, i + 40)
            inner = text[i + 1 : j] if j > 0 else ""
            if j > 0 and inner and (ch == "{" or (len(inner) <= 4 and inner.isalnum())):
                spans.append((i, j + 1))
                i = j + 1
                continue
        if ch == "%" and i + 1 < n and text[i + 1].isalpha():
            spans.append((i, i + 2))
            i += 2
            continue
        i += 1
    taken = [(a, b) for a, b in spans]
    for a, b in _alnum_runs(text):
        if any(c.isdigit() for c in text[a:b]) and not any(s <= a < e for s, e in taken):
            spans.append((a, b))
    return sorted(spans)


def _term_spans(text: str, glossary: Glossary, context: str) -> list[tuple[int, int, str]]:
    runs = _alnum_runs(text)
    keys = [normalise(text[a:b]) for a, b in runs]
    table = {" ".join(words(k.source)): k.target for k in glossary.resolve(context).values()}
    found: list[tuple[int, int, str]] = []
    i = 0
    while i < len(runs):
        for n in range(min(glossary.longest_term, len(runs) - i), 0, -1):
            hit = table.get(" ".join(keys[i : i + n]))
            if hit is not None:
                found.append((runs[i][0], runs[i + n - 1][1], hit))
                i += n
                break
        else:
            i += 1
    return found


def mask(text: str, glossary: Glossary | None, context: str = "") -> Masked:
    """Replace protected spans and glossary terms by tokens, left to right."""
    pieces: list[tuple[int, int, str]] = [(a, b, text[a:b]) for a, b in protected_spans(text)]
    if glossary is not None and glossary.entries:
        pieces += [
            p for p in _term_spans(text, glossary, context) if not any(a < p[1] and p[0] < b for a, b, _ in pieces)
        ]
    pieces.sort()
    out: list[str] = []
    replacements: list[tuple[str, str]] = []
    cursor = 0
    for index, (a, b, replacement) in enumerate(pieces, 1):
        token = f"{TOKEN_OPEN}{index}{TOKEN_CLOSE}"
        out += [text[cursor:a], token]
        replacements.append((token, replacement))
        cursor = b
    out.append(text[cursor:])
    return Masked("".join(out), tuple(replacements))


def unmask(masked: Masked, translated: str) -> tuple[str, bool]:
    """The translation with tokens restored, and whether every token came through."""
    complete = True
    for token, replacement in masked.replacements:
        if token not in translated:
            complete = False
        translated = translated.replace(token, replacement)
    return translated, complete
