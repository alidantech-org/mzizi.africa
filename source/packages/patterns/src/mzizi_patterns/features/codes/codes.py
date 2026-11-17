"""Propose the code of a row from the values of a source row, following a table's code recipe.

A code is a proposal. It follows the grammar (lowercase dashed words joined by dots), but it is only accepted after it is
checked against the codes already known: a row that matches an existing code is that row, not a new one."""

from __future__ import annotations

import re
import unicodedata
from collections.abc import Mapping

from mzizi_patterns.shared.contracts import CodePart, CodeRecipe

SEGMENT = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*$")
MAX_CODE = 255
MAX_SLUG_WORDS = 12  # long enough that a name is not cut; a code that identifies is better than a short one


class RecipeGap(Exception):
    """A part of the recipe has no value yet; the message names the seed column that is missing."""


def slug(text: str, drop: frozenset[str] = frozenset()) -> str:
    """Lowercase ASCII words joined by dashes: `Kiambu County` is `kiambu-county`; with `county` dropped, `kiambu`."""
    folded = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii").casefold()
    words = [w for w in re.split(r"[^a-z0-9]+", folded) if w]
    kept = [w for w in words if w not in drop] or words
    return "-".join(kept[:MAX_SLUG_WORDS])


def last_segment(code: str) -> str:
    return code.rsplit(".", 1)[-1]


def _part(part: CodePart, values: Mapping[str, str], scope: str, drop: frozenset[str]) -> str:
    if part.scope:
        return scope
    if part.const:
        return part.const
    if part.input or part.qualifier:
        key = f"input:{part.input}" if part.input else part.qualifier
        text = values.get(key, "").strip()
        if not text:
            if part.optional:
                return ""
            raise RecipeGap(key)
        return slug(text)
    for field, make in (
        ("slug", lambda v: slug(v)),
        ("name_slug", lambda v: slug(v, drop)),
        ("value", lambda v: slug(v)),
        ("code", lambda v: v),
        ("last", last_segment),
        ("kind", lambda v: last_segment(v)),
    ):
        column = getattr(part, field)
        if column:
            text = values.get(column, "").strip()
            if not text:
                if part.optional:
                    return ""
                raise RecipeGap(column)
            return make(text)
    return ""


def build_code(
    recipe: CodeRecipe,
    values: Mapping[str, str],
    scope: str = "global",
    drop: frozenset[str] = frozenset(),
) -> str:
    """The proposed code; raises RecipeGap when a required value is missing. `drop` are words that only name a kind."""
    segments: list[str] = []
    for part in recipe.parts:
        text = _part(part, values, scope, drop)
        if part.qualifier and text and segments:
            segments[-1] += f"~{text}"  # a qualifier tells two things of one name apart without lengthening the name
        elif text:
            segments.append(text)
    code = ".".join(segments)
    if not code or any(not SEGMENT.match(s) for s in code.split(".")) or len(code) > MAX_CODE:
        raise RecipeGap(f"the result {code!r} does not follow the code grammar")
    return code


def disambiguate(code: str, taken: set[str], qualifiers: tuple[str, ...] = ()) -> str:
    """A code not in `taken`: the code itself, then with each qualifier (a kind, an abbreviation), then with a number."""
    if code not in taken:
        return code
    base, _, tail = code.rpartition(".")
    for qualifier in qualifiers:
        extra = slug(qualifier)
        candidate = f"{base + '.' if base else ''}{tail}~{extra}"
        if extra and candidate not in taken:
            return candidate
    number = 2
    while f"{code}~{number}" in taken:
        number += 1
    return f"{code}~{number}"
