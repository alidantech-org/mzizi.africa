"""Versioned job specs and operation-bound stage requests."""

from typing import Annotated, Literal

from pydantic import BaseModel, Field, PositiveFloat, PositiveInt, SerializeAsAny, StringConstraints

from mzizi_engine.runtime.contracts.base import Frozen

type NonEmpty = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]


class SourceAuthority(Frozen):
    url: NonEmpty
    authority_ref: NonEmpty


class RunLimits(Frozen):
    max_requests: PositiveInt | None = None
    max_seconds: PositiveFloat | None = None
    max_bytes: PositiveInt | None = None


class RankingSpec(Frozen):
    rules_ref: NonEmpty


class PlacementHint(Frozen):
    manifest_ref: NonEmpty


class StageSpec(Frozen):
    operation: NonEmpty
    params: SerializeAsAny[BaseModel]


class JobFields(Frozen):
    spec_version: Literal[1]
    kind: NonEmpty
    name: NonEmpty
    sources: tuple[SourceAuthority, ...] = ()
    mode: Literal["crawl", "hunt"] = "crawl"
    limits: RunLimits = RunLimits()
    ranking: RankingSpec | None = None
    placement_hints: tuple[PlacementHint, ...] = ()


class JobSpec(JobFields):
    stages: Annotated[tuple[StageSpec, ...], Field(min_length=1)]
