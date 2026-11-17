"""Split cell or heading text into word, number and punctuation tokens that remember where they came from."""

from __future__ import annotations

from dataclasses import dataclass

WORD, NUM, PUNCT = "word", "num", "punct"
MAX_TOKENS = 60  # a cell longer than this is prose, not a record to parse


@dataclass(frozen=True)
class Token:
    kind: str
    text: str
    start: int
    end: int

    @property
    def folded(self) -> str:
        return self.text.casefold()


def tokenise(text: str) -> list[Token]:
    """Runs of letters (an inner apostrophe stays), runs of digits, and each other mark; white space separates."""
    out: list[Token] = []
    i, n = 0, len(text)
    while i < n:
        ch = text[i]
        if ch.isspace():
            i += 1
        elif ch.isalpha():
            j = i + 1
            while j < n and (text[j].isalpha() or (text[j] in "'’" and j + 1 < n and text[j + 1].isalpha())):
                j += 1
            out.append(Token(WORD, text[i:j], i, j))
            i = j
        elif ch.isdigit():
            j = i + 1
            while j < n and text[j].isdigit():
                j += 1
            out.append(Token(NUM, text[i:j], i, j))
            i = j
        else:
            out.append(Token(PUNCT, ch, i, i + 1))
            i += 1
        if len(out) > MAX_TOKENS:
            return []
    return out
