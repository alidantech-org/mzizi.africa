"""The only way the CLI reaches the engine: list capabilities and run one. The engine implements this port."""

from __future__ import annotations

from typing import Protocol

from pydantic import BaseModel, ConfigDict

from mzizi_cli.shared.jsonvalue import Payload


class CapabilityInfo(BaseModel):
    model_config = ConfigDict(frozen=True, strict=True, extra="forbid")

    name: str
    version: str
    package: str
    description: str
    cpu_bound: bool
    input_schema: Payload


class EngineGateway(Protocol):
    def describe(self) -> tuple[CapabilityInfo, ...]:
        """Every registered capability and its input contract."""
        ...

    def names(self) -> tuple[str, ...]:
        """Registered capability names, sorted."""
        ...

    def invoke(self, name: str, payload: Payload) -> Payload:
        """Run one registered capability and return its result. Unknown names raise `KeyError`."""
        ...
