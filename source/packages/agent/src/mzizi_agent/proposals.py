"""Attributable proposals: what a model or tool suggested, produced by which method from which inputs."""
from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass, field
from enum import Enum


class ProposalStatus(str, Enum):
    PROPOSED = "proposed"
    ACCEPTED = "accepted"
    REJECTED = "rejected"


@dataclass(frozen=True)
class Proposal:
    """A suggestion. `status` starts as proposed; only a reviewer (a person or an accountable account) changes it, in NestJS."""

    kind: str
    payload: dict
    provider: str
    model: str
    method: str
    input_refs: tuple[str, ...] = ()
    confidence: float | None = None
    status: ProposalStatus = ProposalStatus.PROPOSED
    notes: str = ""
    extra: dict = field(default_factory=dict)

    @property
    def fingerprint(self) -> str:
        """Stable identity of what was proposed, from what, by which method (not the status)."""
        body = json.dumps({"kind": self.kind, "payload": self.payload, "provider": self.provider, "model": self.model, "method": self.method, "inputs": list(self.input_refs)}, sort_keys=True)
        return hashlib.sha256(body.encode()).hexdigest()
