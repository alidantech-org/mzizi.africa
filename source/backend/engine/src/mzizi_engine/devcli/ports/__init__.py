"""Declared capability ports and their live state."""

from mzizi_engine.devcli.ports.declared_core import CORE
from mzizi_engine.devcli.ports.declared_services import SERVICES
from mzizi_engine.devcli.ports.declared_web import WEB
from mzizi_engine.devcli.ports.models import (
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
from mzizi_engine.devcli.ports.models import all_statuses as _all_statuses

PORTS: tuple[Port, ...] = (*CORE, *WEB, *SERVICES)
_BY_NAME = {p.capability: p for p in PORTS}


def get_port(capability: str) -> Port:
    return _BY_NAME[capability]


def all_statuses(*, probe: bool = False) -> list[PortStatus]:
    return _all_statuses(PORTS, probe=probe)


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
