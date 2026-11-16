"""Registering the operations a package orchestrator offers: one generic step for every package."""

from __future__ import annotations

from collections.abc import Iterable

from mzizi_engine.jsonvalue import Payload
from mzizi_engine.runtime.operations import Operation, OperationRegistry, OperationSpec

_ANY_OBJECT: Payload = {"type": "object"}


def register_specs(registry: OperationRegistry, specs: Iterable[OperationSpec], package: str, version: str) -> None:
    for spec in specs:
        registry.register(
            Operation(
                spec.name,
                version,
                package,
                spec.description,
                spec.run,
                _ANY_OBJECT,
                concurrency=spec.concurrency,
                request_model=spec.request_model,
                requires=spec.requires,
                invoke_model=spec.invoke_model,
            )
        )
