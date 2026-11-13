"""The shape of a transform spec and the helpers that read it."""

from __future__ import annotations

from ..core import JsonValue, ScrapeError

#: A transform is a name, a one-key object {name: argument}, or a list applied in order.
type TransformSpec = str | list[TransformSpec] | dict[str, JsonValue]

PIPELINE = "pipeline"


def split(spec: TransformSpec) -> tuple[str, JsonValue]:
    if isinstance(spec, list):
        return PIPELINE, None
    if isinstance(spec, str):
        return spec, None
    if len(spec) != 1:
        raise ScrapeError("a transform object has exactly one key")
    ((name, argument),) = spec.items()
    return name, argument
