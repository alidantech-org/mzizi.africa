"""Extraction profile: what the caller asks an extractor to do and the limits it must respect.

Profiles come from manifests or the engine edge (`parse/profile.py`); extractors never interpret profile names.
"""

from __future__ import annotations

from mzizi_extraction.core.models import Frozen


class Limits(Frozen):
    max_bytes: int = 256 * 1024 * 1024
    max_pages: int = 3000
    table_page_limit: int = 400
    min_text_chars: int = 20


class ExtractionProfile(Frozen):
    ocr: bool = False
    tables: bool = False
    expect_polygons: bool = False
    languages: str = "eng"
    # Property keys whose value names a feature. Supplied by the caller (manifest/profile data), never hard-coded here.
    name_keys: tuple[str, ...] = ()
    limits: Limits = Limits()
