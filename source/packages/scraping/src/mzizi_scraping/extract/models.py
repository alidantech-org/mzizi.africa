"""Typed module and field specs, as validated from a site-structure bundle."""

from __future__ import annotations

from pydantic import ConfigDict, Field

from ..core import External, JsonValue
from ..selectors import Selector
from ..transforms import TransformSpec

type FieldSource = str | list[Selector] | Selector


class FieldSpec(External):
    model_config = ConfigDict(frozen=True, populate_by_name=True, extra="ignore")

    const: JsonValue = None
    source: FieldSource | None = Field(default=None, alias="from")
    regex: str | None = None
    parse: TransformSpec | None = None
    tags: tuple[str, ...] = ()


class ItemSource(External):
    items: list[Selector] | Selector


class Discover(External):
    listing: ItemSource | None = None
    api: ItemSource | None = None


class ExtractSpec(External):
    fields: dict[str, FieldSpec] = Field(default_factory=dict)


class ModuleSpec(External):
    discover: Discover = Discover()
    extract: ExtractSpec = ExtractSpec()
