"""Validate incoming JSON job specs against the registry before a stage can run."""

from typing import Annotated

from pydantic import Field, ValidationError

from mzizi_engine.jsonvalue import Payload
from mzizi_engine.runtime.contracts.base import Frozen
from mzizi_engine.runtime.operations import OperationRegistry
from mzizi_engine.runtime.runs.contracts.spec import JobFields, JobSpec, NonEmpty, StageSpec

PHASE_ONE_OPERATIONS = frozenset({"scraping.crawl", "site.watch"})


class StageInput(Frozen):
    operation: NonEmpty
    params: Payload


class JobInput(JobFields):
    stages: Annotated[tuple[StageInput, ...], Field(min_length=1)]


def parse_job_spec(data: str | bytes, registry: OperationRegistry) -> JobSpec:
    wire = JobInput.model_validate_json(data)
    stages = []
    for stage in wire.stages:
        try:
            registered = registry.get(stage.operation)
        except KeyError as problem:
            raise ValueError(f"Unknown operation {stage.operation!r}") from problem
        if registered.request_model is None:
            raise ValueError(
                f"Operation {stage.operation!r} cannot be used in job specs because it has no request model"
            )
        try:
            params = registered.request_model.model_validate(stage.params, strict=False, extra="forbid")
        except ValidationError as problem:
            raise ValueError(f"Invalid parameters for {stage.operation!r}: {problem}") from problem
        stages.append(StageSpec(operation=stage.operation, params=params))
    fields = JobFields.model_validate(wire.model_dump(exclude={"stages"}))
    return JobSpec(
        spec_version=fields.spec_version,
        kind=fields.kind,
        name=fields.name,
        sources=fields.sources,
        stages=tuple(stages),
        mode=fields.mode,
        limits=fields.limits,
        ranking=fields.ranking,
        placement_hints=fields.placement_hints,
    )
