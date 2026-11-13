"""Captions for tables and figures, found by position and style (and by caption words a profile supplies)."""

from __future__ import annotations

from mzizi_extraction.document.models import Block, FigureBlock, Paragraph, TableBlock
from mzizi_extraction.document.structure import Typography
from mzizi_extraction.text.patterns import starts_with_label

CAPTION_MAX_CHARS = 250


def caption_for(
    block: TableBlock | FigureBlock, paragraphs: list[Paragraph], typ: Typography, labels: tuple[str, ...]
) -> Paragraph | None:
    best: Paragraph | None = None
    reach = 1.5 * typ.body
    for paragraph in paragraphs:
        above = block.bbox[1] - paragraph.bbox[3]
        below = paragraph.bbox[1] - block.bbox[3]
        if not (0 <= above <= reach or 0 <= below <= reach):
            continue
        text = "".join(s.text for s in paragraph.spans).strip()
        if len(text) > CAPTION_MAX_CHARS:
            continue
        styled = (labels and starts_with_label(text, labels)) or all(
            s.italic for s in paragraph.spans if s.text.strip()
        )
        if styled:
            best = paragraph
            break
    return best


def attach_captions(blocks: list[Block], typ: Typography, labels: tuple[str, ...]) -> list[Block]:
    paragraphs = [b for b in blocks if isinstance(b, Paragraph)]
    used: set[int] = set()
    result: list[Block] = []
    for block in blocks:
        if isinstance(block, TableBlock | FigureBlock):
            candidates = [p for p in paragraphs if id(p) not in used]
            caption = caption_for(block, candidates, typ, labels)
            if caption is not None:
                used.add(id(caption))
                text = "".join(s.text for s in caption.spans).strip()
                block = block.model_copy(update={"caption": text})
        result.append(block)
    return [b for b in result if id(b) not in used]
