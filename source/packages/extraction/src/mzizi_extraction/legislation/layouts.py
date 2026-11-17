"""The page layouts for languages other than the English default."""

from __future__ import annotations

import re

from mzizi_extraction.legislation.models import Layout

SW_NUMBERS = {
    "KWANZA": 1,
    "PILI": 2,
    "TATU": 3,
    "NNE": 4,
    "TANO": 5,
    "SITA": 6,
    "SABA": 7,
    "NANE": 8,
    "TISA": 9,
    "KUMI": 10,
    "KUMI NA MOJA": 11,
    "KUMI NA MBILI": 12,
    "KUMI NA TATU": 13,
    "KUMI NA NNE": 14,
    "KUMI NA TANO": 15,
    "KUMI NA SITA": 16,
    "KUMI NA SABA": 17,
    "KUMI NA NANE": 18,
}
SWAHILI = Layout(
    language="sw",
    line_tolerance=5.0,
    top_min=46.0,
    margin_size_below=9.6,
    size_only=True,
    chapter=re.compile(r"^SURA\s+YA\s+(.+?)\s*[–—-]+\s*(.*)$"),
    part=re.compile(r"^Sehemu\s+ya\s+(\d+)\s*[–—-]+\s*(.*)$", re.IGNORECASE),
    header=re.compile(r"^KATIBA YA KENYA.*$|^[xvi]+$|^\d+$|^SIO YA KUUZWA$"),
    numbers=SW_NUMBERS,
    bare_paragraph_marker=True,
)
