"""Extractors turn preserved bytes into segments and diagnostics. They never touch the database."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Callable


@dataclass
class Output:
    status: str  # succeeded | partial | failed
    segments: list[dict] = field(default_factory=list)
    diagnostics: list[dict] = field(default_factory=list)


@dataclass(frozen=True)
class Extractor:
    name: str
    version: str
    run: Callable[[bytes, str | None], Output]


REGISTRY: dict[str, Extractor] = {}


def register(extractor: Extractor) -> Extractor:
    REGISTRY[extractor.name] = extractor
    return extractor


def get(name: str) -> Extractor:
    from . import geojson, html_legal, iebc_commissioners, klrc_constitution, ngcdf_api, ocds, orpp_parties, ppf_distribution, tenders_pe, parliament_members, pdf, worldbank  # noqa: F401  (registers on import)

    if name not in REGISTRY:
        raise KeyError(f"unknown extractor {name!r}; available: {sorted(REGISTRY)}")
    return REGISTRY[name]
