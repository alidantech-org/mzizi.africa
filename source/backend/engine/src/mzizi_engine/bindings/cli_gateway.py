"""The engine's side of the CLI gateway port: the capability registry, as `mzizi_cli` sees it."""

from __future__ import annotations

from mzizi_cli.shared.gateway import CapabilityInfo
from mzizi_cli.shared.jsonvalue import Payload
from mzizi_engine.capabilities import CapabilityRegistry, build_default_registry


class RegistryGateway:
    def __init__(self, registry: CapabilityRegistry | None = None) -> None:
        self._registry = registry if registry is not None else build_default_registry()

    def describe(self) -> tuple[CapabilityInfo, ...]:
        return tuple(
            CapabilityInfo(
                name=item.name,
                version=item.version,
                package=item.package,
                description=item.description,
                cpu_bound=item.cpu_bound,
                input_schema=item.input_schema,
            )
            for item in (self._registry.get(name) for name in self._registry.names())
        )

    def names(self) -> tuple[str, ...]:
        return tuple(self._registry.names())

    def invoke(self, name: str, payload: Payload) -> Payload:
        return self._registry.get(name).handler(payload)
