"""Rows collected per seed file, written with one header per file (the union of the keys, in first-seen order)."""

from __future__ import annotations

from dev_seed.common import Row, write_csv


class Tables:
    def __init__(self) -> None:
        self._rows: dict[str, list[Row]] = {}

    def add(self, path: str, row: Row) -> None:
        self._rows.setdefault(path, []).append(row)

    def rows(self, path: str) -> list[Row]:
        return self._rows.setdefault(path, [])

    def write(self) -> None:
        for path, rows in self._rows.items():
            header: list[str] = []
            for row in rows:
                header.extend(key for key in row if key not in header)
            write_csv(path, header, rows)
