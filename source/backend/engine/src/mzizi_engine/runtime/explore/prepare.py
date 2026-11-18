"""CSV preparation: choose, rename and clean columns of a CSV with the fixed transform library, preview, then save a copy.

Nothing is changed in place. A saved copy goes under the dev root's `prepared/` folder and is refused if it would replace a file.
"""

from __future__ import annotations

import csv
import io
from pathlib import Path

from pydantic import BaseModel, Field

from mzizi_crawler.shared.scraping.transforms import TransformSpec, apply, known
from mzizi_engine.jsonvalue import JsonValue
from mzizi_engine.runtime.explore.files import FileRoots, FilesError

PREVIEW_ROWS = 25
SAVE_FOLDER = "prepared"


class ColumnPlan(BaseModel):
    source: str
    name: str = ""
    clean: list[TransformSpec] = Field(default_factory=list)
    keep: bool = True


class PrepareRequest(BaseModel):
    root: str
    path: str
    columns: list[ColumnPlan]
    skip_empty_rows: bool = True
    save_as: str = ""


class PrepareResult(BaseModel):
    header: tuple[str, ...]
    rows: tuple[tuple[str, ...], ...]
    total_rows: int
    dropped_rows: int
    problems: tuple[str, ...]
    saved: str


def _read(path: Path) -> tuple[list[str], list[list[str]]]:
    delimiter = "\t" if path.suffix.lower() == ".tsv" else ","
    table = list(csv.reader(io.StringIO(path.read_text(encoding="utf-8-sig", errors="replace")), delimiter=delimiter))
    return (table[0], table[1:]) if table else ([], [])


def prepare(roots: FileRoots, request: PrepareRequest) -> PrepareResult:
    header, body = _read(roots.raw(request.root, request.path))
    position = {name: index for index, name in enumerate(header)}
    chosen = [c for c in request.columns if c.keep]
    for column in chosen:
        if column.source not in position:
            raise FilesError(422, f"the file has no column {column.source!r}")
        for step in column.clean:
            if not known(step):
                raise FilesError(422, f"unknown clean step {step!r}")
    problems: list[str] = []
    rows: list[tuple[str, ...]] = []
    dropped = 0
    for number, source in enumerate(body, start=2):
        if request.skip_empty_rows and not any(cell.strip() for cell in source):
            dropped += 1
            continue
        cells: list[str] = []
        for column in chosen:
            value: JsonValue = source[position[column.source]] if position[column.source] < len(source) else ""
            try:
                value = apply(column.clean, value) if column.clean and value not in ("", None) else value
            except Exception as problem:  # a bad cell is reported, never guessed
                problems.append(f"row {number} {column.source}: {problem}")
                value = ""
            cells.append("" if value is None else str(value))
        rows.append(tuple(cells))
    names = tuple(c.name or c.source for c in chosen)
    saved = ""
    if request.save_as:
        name = Path(request.save_as).name
        if not name.endswith(".csv") or name != request.save_as:
            raise FilesError(400, "the saved name must be a plain file name ending in .csv")
        folder = roots.roots["dev"] / SAVE_FOLDER
        target = folder / name
        if target.exists():
            raise FilesError(409, f"{SAVE_FOLDER}/{name} already exists; choose another name")
        folder.mkdir(parents=True, exist_ok=True)
        with target.open("w", encoding="utf-8", newline="") as stream:
            writer = csv.writer(stream)
            writer.writerow(names)
            writer.writerows(rows)
        saved = f"{SAVE_FOLDER}/{name}"
    return PrepareResult(
        header=names,
        rows=tuple(rows[:PREVIEW_ROWS]),
        total_rows=len(rows),
        dropped_rows=dropped,
        problems=tuple(problems[:50]),
        saved=saved,
    )


def save_text(roots: FileRoots, path: str, text: str, overwrite: bool) -> str:
    """Write a human-edited text file (a manifest, module or note) under the dev root; the folder is created if needed."""
    base = roots.roots["dev"]
    target = (base / path).resolve()
    if base not in target.parents or target.suffix.lower() not in {".yml", ".yaml", ".md", ".json", ".txt", ".csv"}:
        raise FilesError(400, "files can be saved under the dev root with a .yml, .yaml, .md, .json, .txt or .csv name")
    if target.exists() and not overwrite:
        raise FilesError(409, "that file already exists; pick another name or confirm the overwrite")
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(text, encoding="utf-8")
    return str(target.relative_to(base))
