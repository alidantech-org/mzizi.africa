"""Extract explicitly selected native PDF columns, preserving source page and region evidence."""

from io import BytesIO

import pdfplumber

from mzizi_extraction.core import Code, Limits, Status, warning
from mzizi_extraction.document.models import DocumentOutput, Page, TableBlock
from mzizi_extraction.document.positioned_models import PositionedTable
from mzizi_extraction.parse.pdf_characters import PdfCharacter, read_characters


def _cells(characters: list[PdfCharacter], selection: PositionedTable) -> tuple[str, ...]:
    cells: list[str] = []
    for col in selection.columns:
        text = "".join(
            c.text for c in sorted(characters, key=lambda c: c.left) if col.left <= (c.left + c.right) / 2 < col.right
        )
        text = text.translate(str.maketrans("", "", col.remove_characters)).strip()
        if col.trim_characters:
            text = text.rstrip(col.trim_characters).strip()
        cells.append(text)
    return tuple(cells)


def extract_positioned_tables(data: bytes, selections: tuple[PositionedTable, ...]) -> DocumentOutput:
    """Read operator-chosen regions only; headings and cleanup rules are explicitly supplied, never inferred."""
    if not data.startswith(b"%PDF"):
        raise ValueError("Expected native PDF bytes")
    if len(data) > Limits().max_bytes:
        raise ValueError("PDF exceeds the extraction byte limit")
    if not selections or len(selections) > Limits().table_page_limit:
        raise ValueError("Supply a bounded, nonempty table selection")
    pages: list[Page] = []
    with pdfplumber.open(BytesIO(data)) as pdf:
        for index, selection in enumerate(selections, start=1):
            if selection.page > len(pdf.pages):
                raise ValueError("Selected page is outside the PDF")
            page = pdf.pages[selection.page - 1]
            left, top, right, bottom = selection.bbox
            if right > page.width or bottom > page.height:
                raise ValueError("Selected region is outside the PDF page")
            lines: list[list[PdfCharacter]] = []
            for char in sorted(read_characters(page), key=lambda c: (c.top, c.left)):
                if not (left <= (char.left + char.right) / 2 < right and top <= char.top < bottom):
                    continue
                if not lines or abs(char.top - lines[-1][0].top) > selection.row_tolerance:
                    lines.append([])
                lines[-1].append(char)
            rows: list[tuple[str, ...]] = []
            for line in lines:
                label = [
                    c
                    for c in line
                    if c.text.strip() and selection.columns[0].left <= c.left < selection.columns[0].right
                ]
                if not label:
                    continue
                start = min(c.left for c in label)
                if (
                    selection.label_left is not None
                    and selection.label_right is not None
                    and not selection.label_left <= start < selection.label_right
                ):
                    continue
                cells = _cells(line, selection)
                if any(cells):
                    rows.append(cells)
            table = TableBlock(
                page=selection.page,
                index=index,
                bbox=selection.bbox,
                rows=(tuple(c.name for c in selection.columns), *rows),
                header_rows=1,
            )
            pages.append(
                Page(number=selection.page, width=float(page.width), height=float(page.height), blocks=(table,))
            )
    return DocumentOutput(
        status=Status.SUCCEEDED
        if all(len(p.blocks[0].rows) > 1 for p in pages if isinstance(p.blocks[0], TableBlock))
        else Status.PARTIAL,
        pages=tuple(pages),
        diagnostics=(
            warning(Code.TABLE_REVIEW, "Operator-selected columns and character cleanup require source review"),
        ),
    )
