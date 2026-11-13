"""Shared input-contract support: seed manifest and folder metadata, site-structure bundle validation."""

from mzizi_manifest import bundle, seed_registry
from mzizi_manifest.validate import Report, validate

__all__ = ["Report", "bundle", "seed_registry", "validate"]
__version__ = "0.1.0"
