"""Structured documents: headings, paragraphs with bold/italic, lists, tables and figures, rendered to Markdown."""

from mzizi_extraction.document.boilerplate import Boilerplate, learn_boilerplate
from mzizi_extraction.document.chunks import Chunk, chunk_markdown
from mzizi_extraction.document.html_backend import extract_html_document
from mzizi_extraction.document.markdown import render_markdown, table_csv
from mzizi_extraction.document.models import (
    Asset,
    Block,
    DocumentOutput,
    FigureBlock,
    Heading,
    ListItem,
    Page,
    Paragraph,
    Span,
    TableBlock,
)
from mzizi_extraction.document.pdf_backend import extract_pdf_document
from mzizi_extraction.document.profile import DocumentProfile, OcrMode
from mzizi_extraction.document.wire import DocumentWire, encode_document

__all__ = [
    "Asset",
    "Block",
    "Boilerplate",
    "Chunk",
    "DocumentOutput",
    "DocumentProfile",
    "DocumentWire",
    "FigureBlock",
    "Heading",
    "ListItem",
    "OcrMode",
    "Page",
    "Paragraph",
    "Span",
    "TableBlock",
    "chunk_markdown",
    "encode_document",
    "extract_html_document",
    "extract_pdf_document",
    "learn_boilerplate",
    "render_markdown",
    "table_csv",
]
