"""Font-name conventions: how bold and italic show up in PDF font names."""

from __future__ import annotations

BOLD_MARKERS = ("bold", "black", "heavy", "semibold", "demi")
ITALIC_MARKERS = ("italic", "oblique")


def is_bold(font_name: str) -> bool:
    lowered = font_name.lower()
    return any(m in lowered for m in BOLD_MARKERS)


def is_italic(font_name: str) -> bool:
    lowered = font_name.lower()
    return any(m in lowered for m in ITALIC_MARKERS)
