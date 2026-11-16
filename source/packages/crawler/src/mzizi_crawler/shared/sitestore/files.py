"""File helpers of the site store: atomic writes, hashes, perceptual hash, page front matter and change notes."""

from __future__ import annotations

import hashlib
import json
import os
from datetime import UTC, datetime
from pathlib import Path

from mzizi_crawler.shared.scraping import Change
from mzizi_crawler.shared.sitestore.models import GENERATOR, PageState, Visit


def timestamp() -> str:
    return datetime.now(UTC).isoformat(timespec="seconds")


def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def atomic_write(path: Path, data: bytes) -> None:
    """Write beside the target, then rename: a reader or a crash never sees half a file."""
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f".{path.name}.tmp")
    temporary.write_bytes(data)
    os.replace(temporary, path)


def visual_hash(png: bytes | None) -> str:
    """A small perceptual hash (8x8 difference hash) of a screenshot; empty when imaging is unavailable."""
    if not png:
        return ""
    try:
        import io

        from PIL import Image
    except ImportError:
        return ""
    image = Image.open(io.BytesIO(png)).convert("L").resize((9, 8))
    pixels = list(image.getdata())
    bits = "".join("1" if pixels[r * 9 + c] > pixels[r * 9 + c + 1] else "0" for r in range(8) for c in range(8))
    return f"{int(bits, 2):016x}"


def front_matter(visit: Visit, state: PageState, html_rel: str, text_sha: str) -> str:
    title = json.dumps(state.title or visit.title, ensure_ascii=False)
    return (
        "---\n"
        f"source_url: {visit.url}\n"
        f"final_url: {visit.final_url}\n"
        f"path: {visit.path}\n"
        f"title: {title}\n"
        f"html_file: {html_rel}\n"
        f"html_sha256: {state.fingerprint.raw}\n"
        f"text_sha256: {text_sha}\n"
        f"fetched_at: {state.last_seen}\n"
        f"version: {state.version}\n"
        f"generator: {GENERATOR}\n"
        "---\n\n"
    )


def change_note(old: PageState, new: PageState, change: Change) -> str:
    lines = [f"# {new.path}: version {old.version} to {new.version}", "", f"- detected: {new.last_seen}"]
    for label, items in (
        ("blocks changed", change.changed_blocks),
        ("blocks added", change.added_blocks),
        ("blocks removed", change.removed_blocks),
        ("links added", change.links_added),
        ("links removed", change.links_removed),
        ("volatile blocks ignored", change.ignored_volatile),
    ):
        if items:
            lines.append(f"- {label}: " + "; ".join(items[:20]) + (" …" if len(items) > 20 else ""))
    return "\n".join(lines) + "\n"
