"""OCR for scanned pages through the system Tesseract (DEC-PDF-EXTRACTION).

Tesseract is a system package (`tesseract`, `tesseract-langpack-eng`, `tesseract-langpack-swa`) run as a subprocess,
so no Python binding or model is bundled. A page is rasterised, read with the requested languages and returned with
a mean confidence (0..1), so a reviewer can see the text is machine-read. A missing engine or language pack is a
clear error, never a silent empty page.
"""

from __future__ import annotations

import csv
import io
import shutil
import subprocess

import pypdfium2 as pdfium
from pydantic import BaseModel, ConfigDict

DEFAULT_LANGUAGES = "eng+swa"
# Page segmentation 4 (one column of variable-sized text) keeps table rows on one line, which 3 often splits.
PSM = "4"
RENDER_SCALE = 4  # about 288 dpi from a 72 dpi page; table digits read more reliably than at 216
TIMEOUT_SECONDS = 120
WORD_LEVEL = "5"


class OcrUnavailable(RuntimeError):
    """The engine or a requested language pack is not installed."""


class Recognition(BaseModel):
    """Text read from one page image and the mean word confidence (0..1)."""

    model_config = ConfigDict(frozen=True)

    text: str
    confidence: float


def _binary() -> str:
    binary = shutil.which("tesseract")
    if not binary:
        raise OcrUnavailable(
            "tesseract is not installed (dnf install tesseract tesseract-langpack-eng tesseract-langpack-swa)"
        )
    return binary


def version() -> str:
    out = subprocess.run([_binary(), "--version"], capture_output=True, text=True, timeout=30, check=False)
    return (out.stdout or out.stderr).splitlines()[0].strip()


def check(languages: str = DEFAULT_LANGUAGES) -> str:
    """Raises OcrUnavailable when the engine or any requested language is missing; returns the engine version."""
    found = version()
    listing = subprocess.run(
        [_binary(), "--list-langs"], capture_output=True, text=True, timeout=30, check=False
    ).stdout.split()
    missing = [lang for lang in languages.split("+") if lang not in listing]
    if missing:
        raise OcrUnavailable(
            f"tesseract language pack missing: {', '.join(missing)} (dnf install tesseract-langpack-{missing[0]})"
        )
    return found


def _read_tsv(tsv: str) -> Recognition:
    lines: dict[tuple[str, str, str], list[str]] = {}
    confidences: list[float] = []
    for row in csv.DictReader(io.StringIO(tsv), delimiter="\t", quoting=csv.QUOTE_NONE):
        word = (row.get("text") or "").strip()
        if not word or row.get("level") != WORD_LEVEL:
            continue
        lines.setdefault((row["block_num"], row["par_num"], row["line_num"]), []).append(word)
        try:
            confidence = float(row["conf"])
        except (TypeError, ValueError):
            continue
        if confidence >= 0:
            confidences.append(confidence)
    text = "\n".join(" ".join(words) for words in lines.values())
    mean = sum(confidences) / len(confidences) / 100 if confidences else 0.0
    return Recognition(text=text, confidence=mean)


def recognise(png: bytes, languages: str = DEFAULT_LANGUAGES) -> Recognition:
    """Text and mean word confidence for one page image."""
    out = subprocess.run(
        [_binary(), "stdin", "stdout", "-l", languages, "--psm", PSM, "tsv"],
        input=png,
        capture_output=True,
        timeout=TIMEOUT_SECONDS,
        check=False,
    )
    if out.returncode != 0:
        raise OcrUnavailable(out.stderr.decode(errors="replace")[:200])
    return _read_tsv(out.stdout.decode("utf-8", errors="replace"))


def render_png(page: pdfium.PdfPage) -> bytes:
    """A pypdfium2 page as PNG bytes."""
    image = page.render(scale=RENDER_SCALE).to_pil().convert("L")
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    return buffer.getvalue()
