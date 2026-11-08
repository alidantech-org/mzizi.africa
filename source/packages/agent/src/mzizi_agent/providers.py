"""Provider-neutral model interface. Concrete providers (hosted models, local models) implement `complete`."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Protocol


@dataclass(frozen=True)
class ModelRequest:
    prompt: str
    system: str | None = None
    parameters: dict = field(default_factory=dict)


@dataclass(frozen=True)
class ModelResponse:
    text: str
    provider: str
    model: str
    usage: dict = field(default_factory=dict)


class ModelProvider(Protocol):
    name: str
    model: str

    def complete(self, request: ModelRequest) -> ModelResponse: ...


@dataclass
class StaticProvider:
    """Deterministic provider for tests and dry runs: answers from a fixed mapping, never calls a network."""

    answers: dict[str, str]
    name: str = "static"
    model: str = "static-v1"

    def complete(self, request: ModelRequest) -> ModelResponse:
        return ModelResponse(self.answers.get(request.prompt, ""), self.name, self.model)
