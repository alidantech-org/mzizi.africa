"""Validate native PDF characters at the pdfplumber parsing boundary."""

import pdfplumber
from pydantic import Field

from mzizi_extraction.core import Frozen


class PdfCharacter(Frozen):
    text: str
    left: float
    right: float
    top: float
    bottom: float
    size: float = Field(ge=0)


def read_characters(page: pdfplumber.page.Page) -> tuple[PdfCharacter, ...]:
    return tuple(
        PdfCharacter(
            text=raw["text"],
            left=float(raw["x0"]),
            right=float(raw["x1"]),
            top=float(raw["top"]),
            bottom=float(raw["bottom"]),
            size=float(raw["size"]),
        )
        for raw in page.chars
    )
