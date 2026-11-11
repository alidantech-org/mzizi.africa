"""Reusable extraction: PDF text/tables, GeoJSON, CSV and JSON. Source-specific parsing belongs in manifests, not here."""

from .geojson import extract_geojson
from .pdf import extract_pdf
from .result import Output
from .tabular import extract_csv, extract_json

#: Public registry of the extractors this package provides (name -> callable(bytes, profile) -> Output).
EXTRACTORS = {"pdf": extract_pdf, "geojson": extract_geojson, "csv": extract_csv, "json": extract_json}

__all__ = ["EXTRACTORS", "Output", "extract_csv", "extract_geojson", "extract_json", "extract_pdf"]
__version__ = "0.1.0"
