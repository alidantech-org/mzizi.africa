"""Edge parser: a profile string from an API payload becomes a typed ExtractionProfile."""

from __future__ import annotations

from ..core import ExtractionProfile

_SEPARATOR = "+"


def parse_profile(name: str | None, name_keys: tuple[str, ...] = ()) -> ExtractionProfile:
    """Understands `ocr`, `tables` and `admin-boundaries` tokens joined by `+`. Unknown tokens are ignored."""
    tokens = set((name or "").split(_SEPARATOR))
    return ExtractionProfile(
        ocr="ocr" in tokens,
        tables="tables" in tokens,
        expect_polygons="admin-boundaries" in tokens,
        name_keys=name_keys,
    )
