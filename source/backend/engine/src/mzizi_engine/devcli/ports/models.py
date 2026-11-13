"""Port types and the requirement checks behind `mzizi status` and `mzizi doctor`."""

from __future__ import annotations

import importlib.util
import os
import shutil
import socket
from dataclasses import dataclass
from enum import Enum
from urllib.parse import urlparse

from mzizi_engine.capabilities import CapabilityRegistry, build_default_registry

PLAN_DOC = ".docs/_plan/mzizi-engine/06-phased-delivery.md"
PENDING = "No handler is registered for this capability yet."
PROBE_TIMEOUT = 0.4


class RequirementKind(str, Enum):
    MODULE = "python module"
    BINARY = "program"
    ENV = "setting"
    SERVICE = "service"


@dataclass(frozen=True)
class Requirement:
    kind: RequirementKind
    names: tuple[str, ...]
    hint: str

    @property
    def label(self) -> str:
        return " | ".join(self.names)


class PortState(str, Enum):
    READY = "ready"
    UNAVAILABLE = "needs setup"
    NOT_YET_ADDED = "not yet added"


@dataclass(frozen=True)
class Port:
    capability: str
    package: str
    summary: str
    phase: int
    reason: str
    requires: tuple[Requirement, ...] = ()


@dataclass(frozen=True)
class RequirementCheck:
    requirement: Requirement
    satisfied: bool
    detail: str


@dataclass(frozen=True)
class PortStatus:
    port: Port
    registered: bool
    state: PortState
    checks: tuple[RequirementCheck, ...]

    @property
    def missing(self) -> tuple[RequirementCheck, ...]:
        return tuple(c for c in self.checks if not c.satisfied)


def module(name: str, hint: str) -> Requirement:
    return Requirement(RequirementKind.MODULE, (name,), hint)


def binary(*names: str, hint: str) -> Requirement:
    return Requirement(RequirementKind.BINARY, names, hint)


def env(name: str, hint: str) -> Requirement:
    return Requirement(RequirementKind.ENV, (name,), hint)


def service(env_name: str, hint: str) -> Requirement:
    return Requirement(RequirementKind.SERVICE, (env_name,), hint)


def declare(
    capability: str, package: str, summary: str, phase: int, reason: str = PENDING, *requires: Requirement
) -> Port:
    return Port(capability, package, summary, phase, reason, requires)


def check_requirement(requirement: Requirement, *, probe: bool = False) -> RequirementCheck:
    match requirement.kind:
        case RequirementKind.MODULE:
            found = importlib.util.find_spec(requirement.names[0]) is not None
            return RequirementCheck(requirement, found, "installed" if found else "not installed")
        case RequirementKind.BINARY:
            for name in requirement.names:
                path = shutil.which(name)
                if path:
                    return RequirementCheck(requirement, True, path)
            return RequirementCheck(requirement, False, "not on PATH")
        case RequirementKind.ENV:
            present = bool(os.environ.get(requirement.names[0]))
            return RequirementCheck(requirement, present, "set" if present else "not set")
        case RequirementKind.SERVICE:
            value = os.environ.get(requirement.names[0])
            if not value:
                return RequirementCheck(requirement, False, f"{requirement.names[0]} not set")
            if not probe:
                return RequirementCheck(requirement, True, f"{value} (not probed)")
            satisfied, detail = _probe_tcp(value)
            return RequirementCheck(requirement, satisfied, detail)


def _probe_tcp(url: str) -> tuple[bool, str]:
    parsed = urlparse(url)
    if not parsed.hostname or not parsed.port:
        return False, f"{url}: needs host and port"
    try:
        with socket.create_connection((parsed.hostname, parsed.port), timeout=PROBE_TIMEOUT):
            return True, f"{url} reachable"
    except OSError as exc:
        return False, f"{url} unreachable ({exc.__class__.__name__})"


def port_status(port: Port, registry: CapabilityRegistry, *, probe: bool = False) -> PortStatus:
    registered = port.capability in registry.names()
    checks = tuple(check_requirement(r, probe=probe) for r in port.requires)
    if not registered:
        state = PortState.NOT_YET_ADDED
    elif any(not c.satisfied for c in checks):
        state = PortState.UNAVAILABLE
    else:
        state = PortState.READY
    return PortStatus(port, registered, state, checks)


def all_statuses(ports: tuple[Port, ...], *, probe: bool = False) -> list[PortStatus]:
    registry = build_default_registry()
    return [port_status(p, registry, probe=probe) for p in ports]
