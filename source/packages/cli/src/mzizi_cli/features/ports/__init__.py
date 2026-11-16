"""Declared capability ports and their live state."""

from collections.abc import Collection

from mzizi_cli.features.ports.declared_core import CORE
from mzizi_cli.features.ports.declared_web import WEB
from mzizi_cli.features.ports.models import (
    PLAN_DOC,
    Port,
    PortState,
    PortStatus,
    Requirement,
    RequirementCheck,
    RequirementKind,
    check_requirement,
    port_status,
)
from mzizi_cli.features.ports.models import all_statuses as _all_statuses

PORTS: tuple[Port, ...] = (*CORE, *WEB)
_BY_NAME = {p.capability: p for p in PORTS}


def get_port(capability: str) -> Port:
    return _BY_NAME[capability]


def all_statuses(registered_names: Collection[str], *, probe: bool = False) -> list[PortStatus]:
    return _all_statuses(PORTS, registered_names, probe=probe)


__all__ = [
    "PLAN_DOC",
    "PORTS",
    "Port",
    "PortState",
    "PortStatus",
    "Requirement",
    "RequirementCheck",
    "RequirementKind",
    "all_statuses",
    "check_requirement",
    "get_port",
    "port_status",
]
