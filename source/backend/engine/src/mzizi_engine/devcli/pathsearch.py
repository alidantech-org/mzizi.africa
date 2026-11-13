"""Fast, bounded file search for interactive prompts.

The scan never walks unbounded trees: it has an entry cap, a depth cap and a time budget, skips heavy folders, and
reports when it stopped early, so a prompt can never freeze the terminal on a large repository.
"""

from __future__ import annotations

import difflib
import os
import time
from dataclasses import dataclass
from pathlib import Path

SKIPPED_FOLDERS = frozenset(
    {
        ".git",
        "node_modules",
        ".venv",
        "venv",
        "target",
        "__pycache__",
        ".next",
        ".ruff_cache",
        ".mypy_cache",
        ".pytest_cache",
        "dist",
        "build",
        ".docs",
    }
)


@dataclass(frozen=True)
class SearchBudget:
    max_entries: int = 20_000
    max_seconds: float = 0.25
    max_depth: int = 6


@dataclass(frozen=True)
class Candidate:
    path: Path
    label: str
    mtime: float


@dataclass(frozen=True)
class PathIndex:
    candidates: tuple[Candidate, ...]
    scanned: int
    elapsed: float
    truncated: bool

    def labels(self) -> list[str]:
        return [c.label for c in self.candidates]

    def resolve(self, label: str) -> Path | None:
        for candidate in self.candidates:
            if candidate.label == label:
                return candidate.path
        return None

    def suggest(self, query: str, limit: int = 5) -> list[str]:
        lowered = query.lower()
        contains = [c.label for c in self.candidates if lowered in c.label.lower()]
        if len(contains) >= limit:
            return contains[:limit]
        close = difflib.get_close_matches(query, self.labels(), n=limit, cutoff=0.4)
        return [*contains, *[c for c in close if c not in contains]][:limit]


def build_index(
    roots: list[Path],
    *,
    want_dirs: bool,
    want_files: bool,
    suffixes: tuple[str, ...] = (),
    budget: SearchBudget | None = None,
) -> PathIndex:
    """Breadth-first scan of `roots` in priority order; earlier roots are listed first and scanned first."""
    budget = budget or SearchBudget()
    started = time.monotonic()
    found: list[Candidate] = []
    scanned = 0
    truncated = False
    for root in roots:
        if not root.is_dir():
            continue
        queue: list[tuple[Path, int]] = [(root, 0)]
        while queue:
            folder, depth = queue.pop(0)
            if scanned >= budget.max_entries or time.monotonic() - started > budget.max_seconds:
                truncated = True
                break
            try:
                with os.scandir(folder) as entries:
                    for entry in entries:
                        scanned += 1
                        path = Path(entry.path)
                        if entry.is_dir(follow_symlinks=False):
                            if entry.name in SKIPPED_FOLDERS or entry.name.startswith("."):
                                continue
                            if want_dirs:
                                found.append(Candidate(path, _label(root, path), _mtime(entry)))
                            if depth < budget.max_depth:
                                queue.append((path, depth + 1))
                        elif want_files and (not suffixes or path.suffix.lower() in suffixes):
                            found.append(Candidate(path, _label(root, path), _mtime(entry)))
            except OSError:
                continue
        if truncated:
            break
    return PathIndex(tuple(found), scanned, time.monotonic() - started, truncated)


def _label(root: Path, path: Path) -> str:
    try:
        return str(path.relative_to(root))
    except ValueError:
        return str(path)


def _mtime(entry: os.DirEntry[str]) -> float:
    try:
        return entry.stat(follow_symlinks=False).st_mtime
    except OSError:
        return 0.0
