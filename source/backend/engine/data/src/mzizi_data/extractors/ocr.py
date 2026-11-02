"""OCR for scanned pages through the system Tesseract (DEC-PDF-EXTRACTION).

Tesseract is a system package (`tesseract`, `tesseract-langpack-eng`, `tesseract-langpack-swa`), run as a
subprocess so no Python binding or model is bundled. Each page is rasterised, read with the requested
languages and returned with the engine, version, languages and a per-page mean confidence (0..1), so
a reviewer can see OCR text is machine-read. A missing engine or language pack is a clear error, never a
silent empty page.
"""
from __future__ import annotations

import csv
import io
import shutil
import subprocess

DEFAULT_LANGUAGES = "eng+swa"
RENDER_SCALE = 3  # about 216 dpi from a 72 dpi page
TIMEOUT_SECONDS = 120


class OcrUnavailable(RuntimeError):
    """The engine or a requested language pack is not installed."""


def version() -> str:
    binary = shutil.which("tesseract")
    if not binary:
        raise OcrUnavailable("tesseract is not installed (dnf install tesseract tesseract-langpack-eng tesseract-langpack-swa)")
    out = subprocess.run([binary, "--version"], capture_output=True, text=True, timeout=30)
    return (out.stdout or out.stderr).splitlines()[0].strip()


def check(languages: str = DEFAULT_LANGUAGES) -> str:
    """Raises OcrUnavailable when the engine or any requested language is missing; returns the engine version."""
    found = version()
    listing = subprocess.run(["tesseract", "--list-langs"], capture_output=True, text=True, timeout=30).stdout.split()
    missing = [lang for lang in languages.split("+") if lang not in listing]
    if missing:
        raise OcrUnavailable(f"tesseract language pack missing: {', '.join(missing)} (dnf install tesseract-langpack-{missing[0]})")
    return found


def recognise(png: bytes, languages: str = DEFAULT_LANGUAGES) -> tuple[str, float]:
    """Text and mean word confidence (0..1) for one page image."""
    out = subprocess.run(["tesseract", "stdin", "stdout", "-l", languages, "--psm", "3", "tsv"], input=png, capture_output=True, timeout=TIMEOUT_SECONDS)
    if out.returncode != 0:
        raise OcrUnavailable(out.stderr.decode(errors="replace")[:200])
    rows = list(csv.DictReader(io.StringIO(out.stdout.decode("utf-8", errors="replace")), delimiter="\t", quoting=csv.QUOTE_NONE))
    lines: dict[tuple, list[str]] = {}
    confidences: list[float] = []
    for row in rows:
        word = (row.get("text") or "").strip()
        if not word or row.get("level") != "5":
            continue
        lines.setdefault((row["block_num"], row["par_num"], row["line_num"]), []).append(word)
        try:
            confidence = float(row["conf"])
        except (TypeError, ValueError):
            continue
        if confidence >= 0:
            confidences.append(confidence)
    text = "\n".join(" ".join(words) for words in lines.values())
    return text, (sum(confidences) / len(confidences) / 100 if confidences else 0.0)


def render_png(page) -> bytes:
    """A pypdfium2 page as PNG bytes."""
    image = page.render(scale=RENDER_SCALE).to_pil().convert("L")
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    return buffer.getvalue()
