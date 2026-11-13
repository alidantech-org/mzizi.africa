"""Reusable extraction: PDF text/tables (with OCR), GeoJSON, CSV and JSON. Source-specific parsing belongs in manifests."""

from collections.abc import Callable

from .core import ExtractionProfile, Limits, Output
from .encode import WireOutput, encode_output
from .geo import extract_geojson
from .parse import parse_profile
from .pdf import extract_pdf
from .tabular import extract_csv, extract_json

type Extractor = Callable[[bytes, ExtractionProfile | None], Output]

#: Public registry of the extractors this package provides (name -> callable(bytes, profile) -> Output).
EXTRACTORS: dict[str, Extractor] = {
    "pdf": extract_pdf,
    "geojson": extract_geojson,
    "csv": extract_csv,
    "json": extract_json,
}

__all__ = [
    "EXTRACTORS",
    "ExtractionProfile",
    "Extractor",
    "Limits",
    "Output",
    "WireOutput",
    "encode_output",
    "extract_csv",
    "extract_geojson",
    "extract_json",
    "extract_pdf",
    "parse_profile",
]
__version__ = "0.1.0"
