"""Labelled examples for classification: a YAML file of labels, each with example texts."""

from __future__ import annotations

from pathlib import Path

import yaml
from pydantic import BaseModel, ConfigDict


class LabelSet(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    name: str
    examples: tuple[str, ...]


class LabelFile(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    labels: tuple[LabelSet, ...]


def parse_labels(text: str) -> LabelFile:
    """The parsing boundary: `labels: [{name: budget, examples: [..]}]`."""
    return LabelFile.model_validate(yaml.safe_load(text), strict=False)


def read_labels(path: Path) -> LabelFile:
    return parse_labels(path.read_text(encoding="utf-8"))
