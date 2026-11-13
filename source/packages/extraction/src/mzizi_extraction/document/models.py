"""Typed contracts for a structured document. Source-neutral: a PDF backend fills them today, an HTML one can later."""

from __future__ import annotations

from typing import Annotated, Literal

from pydantic import Field

from mzizi_extraction.core import Diagnostic, Frozen, Status

type BBox = tuple[float, float, float, float]


class Span(Frozen):
    text: str
    bold: bool = False
    italic: bool = False
    href: str | None = None


class Heading(Frozen):
    kind: Literal["heading"] = "heading"
    level: int
    spans: tuple[Span, ...]
    page: int
    bbox: BBox


class Paragraph(Frozen):
    kind: Literal["paragraph"] = "paragraph"
    spans: tuple[Span, ...]
    page: int
    bbox: BBox


class ListItem(Frozen):
    kind: Literal["list_item"] = "list_item"
    ordered: bool
    marker: str
    spans: tuple[Span, ...]
    page: int
    bbox: BBox


class TableBlock(Frozen):
    kind: Literal["table"] = "table"
    index: int
    rows: tuple[tuple[str, ...], ...]
    header_rows: int
    caption: str | None = None
    page: int
    bbox: BBox


class FigureBlock(Frozen):
    kind: Literal["figure"] = "figure"
    asset: str
    figure_kind: Literal["image", "diagram"]
    alt: str
    caption: str | None = None
    page: int
    bbox: BBox


type Block = Annotated[Heading | Paragraph | ListItem | TableBlock | FigureBlock, Field(discriminator="kind")]


class Page(Frozen):
    number: int
    width: float
    height: float
    blocks: tuple[Block, ...]
    ocr: bool = False
    ocr_confidence: float | None = None


class Asset(Frozen):
    name: str
    media_type: str
    data: bytes


class DocumentOutput(Frozen):
    status: Status
    pages: tuple[Page, ...] = ()
    assets: tuple[Asset, ...] = ()
    diagnostics: tuple[Diagnostic, ...] = ()
