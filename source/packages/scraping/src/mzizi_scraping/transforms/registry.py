"""The fixed transform library. A transform not listed here fails validation; nothing executes arbitrary code."""

from __future__ import annotations

from collections.abc import Callable

from mzizi_scraping.core import JsonValue, ScrapeError
from mzizi_scraping.transforms import mapping, numeric, textual
from mzizi_scraping.transforms.spec import PIPELINE, TransformSpec, split

type Transform = Callable[[JsonValue, JsonValue], JsonValue]

LIBRARY: dict[str, Transform] = {
    "trim": textual.trim,
    "collapse_whitespace": textual.collapse,
    "nfc": textual.nfc,
    "upper": textual.upper,
    "lower": textual.lower,
    "normalise_name": textual.normalise_name,
    "clean_ordinal": textual.clean_ordinal,
    "regex": textual.regex,
    "slug_code": textual.slug_code,
    "prefix": textual.prefix,
    "suffix": textual.suffix,
    "date": numeric.to_date,
    "decimal": numeric.to_decimal,
    "fiscal_year": numeric.fiscal_year,
    "fy_start": numeric.fy_start,
    "lookup": mapping.lookup,
    "ref": mapping.reference,
}


def known(spec: TransformSpec) -> bool:
    if isinstance(spec, list):
        return bool(spec) and all(known(step) for step in spec)
    return split(spec)[0] in LIBRARY


def apply(spec: TransformSpec, value: JsonValue) -> JsonValue:
    if isinstance(spec, list):
        for step in spec:
            value = apply(step, value)
        return value
    name, argument = split(spec)
    if name == PIPELINE or name not in LIBRARY:
        raise ScrapeError(f"unknown transform: {name}")
    return LIBRARY[name](value, argument)
