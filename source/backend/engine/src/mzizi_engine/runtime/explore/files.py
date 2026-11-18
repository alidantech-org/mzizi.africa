"""Browse and view files under a few named roots (seed, dev, runs, docs). Read-only; paths never leave their root."""

from __future__ import annotations

import csv
import io
import json
from datetime import UTC, datetime
from pathlib import Path
from typing import Literal

import yaml
from pydantic import BaseModel

from mzizi_engine.jsonvalue import JsonValue

MAX_TEXT_BYTES = 2_000_000
MAX_ROWS = 500
TEXT_SUFFIXES = {
    ".md": "markdown",
    ".markdown": "markdown",
    ".csv": "csv",
    ".tsv": "csv",
    ".json": "json",
    ".jsonl": "jsonl",
    ".yml": "yaml",
    ".yaml": "yaml",
    ".txt": "text",
    ".log": "text",
    ".html": "text",
    ".py": "text",
    ".sql": "text",
    ".toml": "text",
}
BINARY_KINDS = {
    ".pdf": "pdf",
    ".png": "image",
    ".jpg": "image",
    ".jpeg": "image",
    ".gif": "image",
    ".webp": "image",
    ".zip": "binary",
}

type Kind = Literal["markdown", "csv", "json", "jsonl", "yaml", "text", "pdf", "image", "binary"]


class FilesError(Exception):
    def __init__(self, status: int, message: str) -> None:
        super().__init__(message)
        self.status = status


class Entry(BaseModel):
    name: str
    path: str
    directory: bool
    size: int
    modified: str
    kind: str


class Listing(BaseModel):
    root: str
    path: str
    parent: str | None
    entries: tuple[Entry, ...]


class FileView(BaseModel):
    root: str
    path: str
    name: str
    kind: str
    size: int
    modified: str
    truncated: bool
    text: str | None
    header: tuple[str, ...]
    rows: tuple[tuple[str, ...], ...]
    total_rows: int | None
    parsed: JsonValue
    actions: tuple[str, ...]


def kind_of(path: Path) -> str:
    suffix = path.suffix.lower()
    return TEXT_SUFFIXES.get(suffix) or BINARY_KINDS.get(suffix) or "binary"


def _stamp(path: Path) -> str:
    return datetime.fromtimestamp(path.stat().st_mtime, UTC).isoformat(timespec="seconds")


class FileRoots:
    def __init__(self, roots: dict[str, Path]) -> None:
        self.roots = roots

    def names(self) -> tuple[str, ...]:
        return tuple(self.roots)

    def resolve(self, root: str, relative: str) -> Path:
        base = self.roots.get(root)
        if base is None:
            raise FilesError(404, f"unknown root {root!r}; available: {', '.join(self.roots)}")
        target = (base / relative).resolve() if relative else base
        if target != base and base not in target.parents:
            raise FilesError(400, "the path leaves its root")
        if not target.exists():
            raise FilesError(404, "no such file or folder")
        return target

    def list(self, root: str, relative: str) -> Listing:
        folder = self.resolve(root, relative)
        base = self.roots[root]
        if folder.is_file():  # a file path lists the folder that holds it, so a viewer can show both
            folder = folder.parent
            relative = "" if folder == base else str(folder.relative_to(base))
        entries: list[Entry] = []
        for child in sorted(folder.iterdir(), key=lambda p: (not p.is_dir(), p.name.lower())):
            if child.name.startswith(".") and child.name not in {".metadata"} and relative == "" and root != "dev":
                continue
            try:
                directory = child.is_dir()
                entries.append(
                    Entry(
                        name=child.name,
                        path=str(child.relative_to(base)),
                        directory=directory,
                        size=0 if directory else child.stat().st_size,
                        modified=_stamp(child),
                        kind="folder" if directory else kind_of(child),
                    )
                )
            except OSError:
                continue
        parent = None if folder == base else str(folder.parent.relative_to(base)) if folder.parent != base else ""
        return Listing(root=root, path=relative, parent=parent, entries=tuple(entries[:2000]))

    def view(self, root: str, relative: str, offset: int = 0, limit: int = 100) -> FileView:
        path = self.resolve(root, relative)
        if not path.is_file():
            raise FilesError(400, "not a file")
        kind = kind_of(path)
        base = FileView(
            root=root,
            path=relative,
            name=path.name,
            kind=kind,
            size=path.stat().st_size,
            modified=_stamp(path),
            truncated=False,
            text=None,
            header=(),
            rows=(),
            total_rows=None,
            parsed=None,
            actions=(),
        )
        actions = {
            "pdf": ("extraction.pdf", "extraction.markdown"),
            "csv": ("extraction.csv",),
            "json": ("extraction.json",),
        }
        if kind in {"pdf", "image", "binary"}:
            return base.model_copy(update={"actions": actions.get(kind, ())})
        with path.open("rb") as stream:
            raw = stream.read(MAX_TEXT_BYTES + 1)
        truncated = len(raw) > MAX_TEXT_BYTES
        text = raw[:MAX_TEXT_BYTES].decode("utf-8", errors="replace")
        base = base.model_copy(update={"truncated": truncated})
        if kind == "csv":
            delimiter = "\t" if path.suffix.lower() == ".tsv" else ","
            table = list(csv.reader(io.StringIO(text), delimiter=delimiter))
            header, body = (tuple(table[0]), table[1:]) if table else ((), [])
            window = tuple(tuple(r) for r in body[max(0, offset) : max(0, offset) + max(1, min(limit, MAX_ROWS))])
            return base.model_copy(
                update={"header": header, "rows": window, "total_rows": len(body), "actions": actions["csv"]}
            )
        if kind == "json":
            try:
                parsed: JsonValue = json.loads(text) if not truncated else None
            except json.JSONDecodeError:
                return base.model_copy(update={"text": text})
            return base.model_copy(
                update={
                    "text": text if len(text) < 200_000 else None,
                    "parsed": parsed,
                    "actions": actions["json"],
                }
            )
        if kind == "yaml":
            try:
                document = yaml.safe_load(text)
            except yaml.YAMLError:
                document = None
            shown = json.loads(json.dumps(document, default=str)) if isinstance(document, (dict, list)) else None
            return base.model_copy(update={"text": text, "parsed": shown})
        return base.model_copy(update={"text": text})

    def raw(self, root: str, relative: str) -> Path:
        path = self.resolve(root, relative)
        if not path.is_file():
            raise FilesError(400, "not a file")
        return path
