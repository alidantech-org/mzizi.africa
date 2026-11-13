"""Reusable extraction: PDF text/tables (with OCR), GeoJSON, CSV and JSON. Source-specific parsing belongs in manifests."""

from collections.abc import Callable

from mzizi_extraction.core import ExtractionProfile, Limits, Output
from mzizi_extraction.encode import WireOutput, encode_output
from mzizi_extraction.geo import extract_geojson
from mzizi_extraction.parse import parse_profile
from mzizi_extraction.pdf import extract_pdf
from mzizi_extraction.tabular import extract_csv, extract_json

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
