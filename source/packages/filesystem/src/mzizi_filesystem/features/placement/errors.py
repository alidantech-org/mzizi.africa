"""The failure a placement can have."""

from __future__ import annotations


class PlacementError(ValueError):
    """The requested placement is invalid or needs a justification it does not carry."""
