"""Operations: the named, versioned functions the runtime exposes to front doors (CLI, HTTP, agent, workers).

An operation is a package capability reduced to what a caller needs: a name, a version, an input contract and a handler
that takes and returns JSON-able payloads. Handlers live at module level so they can run in worker processes.
Registering an operation is code; a caller can only name one that is registered.
"""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from enum import StrEnum

from pydantic import BaseModel

from mzizi_engine.jsonvalue import Payload
from mzizi_engine.runtime.contracts.base import Frozen


class Requirement(StrEnum):
    """A service or configuration required by an operation."""

    POSTGRES = "postgres"
    S3 = "s3"
    MONGO = "mongo"
    BROWSER = "browser"
    USER_AGENT = "user_agent"
    SEARCH_KEYS = "search_keys"
    INPUT_ROOT = "input_root"


class OperationInfo(Frozen):
    """What a caller may learn about an operation without running it."""

    name: str
    version: str
    package: str
    description: str
    cpu_bound: bool
    input_schema: Payload


@dataclass(frozen=True)
class Operation:
    name: str
    version: str
    package: str
    description: str
    handler: Callable[[Payload], Payload]
    input_schema: Payload
    cpu_bound: bool = False
    concurrency: int | None = None
    request_model: type[BaseModel] | None = None
    requires: frozenset[Requirement] = frozenset()
    invoke_model: Callable[[BaseModel], Payload] | None = None

    def info(self) -> OperationInfo:
        return OperationInfo(
            name=self.name,
            version=self.version,
            package=self.package,
            description=self.description,
            cpu_bound=self.cpu_bound,
            input_schema=self.input_schema,
        )


class OperationRegistry:
    def __init__(self) -> None:
        self._items: dict[str, Operation] = {}

    def register(self, operation: Operation) -> Operation:
        if operation.name in self._items:
            raise ValueError(f"operation {operation.name!r} is already registered")
        self._items[operation.name] = operation
        return operation

    def get(self, name: str) -> Operation:
        if name not in self._items:
            raise KeyError(name)
        return self._items[name]

    def names(self) -> tuple[str, ...]:
        return tuple(sorted(self._items))

    def describe(self) -> tuple[OperationInfo, ...]:
        return tuple(self._items[name].info() for name in self.names())


@dataclass(frozen=True)
class OperationSpec:
    name: str
    description: str
    run: Callable[[Payload], Payload]
    #: Highest number of simultaneous runs; `None` leaves the runtime's default.
    concurrency: int | None = None
    request_model: type[BaseModel] | None = None
    requires: frozenset[Requirement] = frozenset()
    invoke_model: Callable[[BaseModel], Payload] | None = None


def operation[R: BaseModel](
    name: str,
    description: str,
    model: type[R],
    handler: Callable[[R], BaseModel],
    concurrency: int | None = None,
    *,
    requires: frozenset[Requirement] = frozenset(),
) -> OperationSpec:
    def invoke_model(request: BaseModel) -> Payload:
        if not isinstance(request, model):
            raise TypeError(f"Operation {name!r} requires a {model.__name__} request")
        return handler(request).model_dump(mode="json")

    def run(payload: Payload) -> Payload:
        return invoke_model(model.model_validate(payload, strict=False))

    run.__name__ = handler.__name__
    return OperationSpec(name, description, run, concurrency, model, requires, invoke_model)
