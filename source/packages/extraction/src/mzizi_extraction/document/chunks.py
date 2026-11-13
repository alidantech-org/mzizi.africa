"""Splits Markdown into chunks for retrieval: heading-aware, bounded in size, with the heading path kept."""

from __future__ import annotations

from mzizi_extraction.core import Frozen

DEFAULT_MAX_CHARS = 1200
DEFAULT_MIN_CHARS = 80
HEADING_MARK = "#"
COMMENT_OPEN = "<!--"


class Chunk(Frozen):
    index: int
    heading_path: tuple[str, ...]
    text: str


def _heading(line: str) -> tuple[int, str] | None:
    stripped = line.strip()
    level = len(stripped) - len(stripped.lstrip(HEADING_MARK))
    if 0 < level <= 6 and stripped[level : level + 1] == " ":
        return level, stripped[level + 1 :].strip()
    return None


def _skippable(line: str) -> bool:
    return line.strip().startswith(COMMENT_OPEN)


def _split_long(paragraph: str, limit: int) -> list[str]:
    """Breaks an over-long paragraph at sentence-like boundaries (whitespace), never mid-word."""
    pieces: list[str] = []
    current: list[str] = []
    size = 0
    for word in paragraph.split():
        if size + len(word) + 1 > limit and current:
            pieces.append(" ".join(current))
            current, size = [], 0
        current.append(word)
        size += len(word) + 1
    if current:
        pieces.append(" ".join(current))
    return pieces


def chunk_markdown(text: str, max_chars: int = DEFAULT_MAX_CHARS, min_chars: int = DEFAULT_MIN_CHARS) -> list[Chunk]:
    """Chunks never cross a heading; paragraphs are packed up to `max_chars`; tiny trailing pieces join the previous chunk."""
    path: list[tuple[int, str]] = []
    blocks: list[tuple[tuple[str, ...], str]] = []
    paragraph: list[str] = []

    def flush() -> None:
        if paragraph:
            blocks.append((tuple(title for _, title in path), "\n".join(paragraph).strip()))
            paragraph.clear()

    for line in text.splitlines():
        if _skippable(line):
            continue
        found = _heading(line)
        if found is not None:
            flush()
            level, title = found
            while path and path[-1][0] >= level:
                path.pop()
            path.append((level, title))
            continue
        if not line.strip():
            flush()
        else:
            paragraph.append(line)
    flush()
    return _pack(blocks, max_chars, min_chars)


def _pack(blocks: list[tuple[tuple[str, ...], str]], max_chars: int, min_chars: int) -> list[Chunk]:
    chunks: list[tuple[tuple[str, ...], str]] = []
    for heading_path, body in blocks:
        for piece in _split_long(body, max_chars) if len(body) > max_chars else [body]:
            if chunks and chunks[-1][0] == heading_path and len(chunks[-1][1]) + len(piece) + 2 <= max_chars:
                chunks[-1] = (heading_path, f"{chunks[-1][1]}\n\n{piece}")
            else:
                chunks.append((heading_path, piece))
    merged: list[tuple[tuple[str, ...], str]] = []
    for heading_path, body in chunks:
        if merged and len(body) < min_chars and merged[-1][0] == heading_path:
            merged[-1] = (heading_path, f"{merged[-1][1]}\n\n{body}")
        else:
            merged.append((heading_path, body))
    return [Chunk(index=i, heading_path=path, text=body) for i, (path, body) in enumerate(merged) if body.strip()]
