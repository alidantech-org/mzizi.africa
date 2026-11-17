"""The typed inputs and results of a drafting run: per-source defaults, review notes and the result."""

from __future__ import annotations

import csv
from pathlib import Path

import yaml
from pydantic import BaseModel, ConfigDict, Field


class Defaults(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    describe: str = ""
    tables: dict[str, dict[str, str]] = Field(default_factory=dict)
    reads_as: dict[str, dict[str, dict[str, str]]] = Field(default_factory=dict)
    roles: dict[str, dict[str, str]] = Field(
        default_factory=dict
    )  # kind of entity by the role it plays (buyer, bidder)
    inputs: dict[str, str] = Field(default_factory=dict)  # named values for recipes: tender_reference, buyer
    emit: tuple[str, ...] = ()
    copy_from: dict[str, str] = Field(default_factory=dict, alias="copy")


class DraftNote(BaseModel):
    table: str
    code: str
    source_row: int
    status: str  # new, matched, placeholder or gap
    missing: tuple[str, ...] = ()
    note: str = ""


class DraftResult(BaseModel):
    out_dir: str
    rows: dict[str, int]
    notes: tuple[DraftNote, ...]
    needs_approval: dict[str, int]
    unapproved_values: tuple[str, ...] = ()


def load_defaults(path: Path | None) -> Defaults:
    return Defaults.model_validate(yaml.safe_load(path.read_text(encoding="utf-8"))) if path else Defaults()


def read_rows(csv_path: Path) -> list[dict[str, str]]:
    with csv_path.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.reader(handle)
        header = [" ".join(h.split()) for h in next(reader)]
        return [dict(zip(header, row, strict=False)) for row in reader]
