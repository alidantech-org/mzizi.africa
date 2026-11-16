"""Named failures of the runtime, so callers can tell a busy capability from a misuse."""

from __future__ import annotations


class RuntimeFailure(RuntimeError):
    """Base of every runtime error."""


class RuntimeStateError(RuntimeFailure):
    """The call is not allowed in the runtime's current state (for example running a job before `start`)."""


class CapabilityNotRegisteredError(RuntimeFailure):
    """No capability is registered under that name."""


class CapabilityNotExposedError(RuntimeFailure):
    """A front door called a capability whose plan marks it internal."""


class QueueTimeoutError(RuntimeFailure):
    """No slot became free within the capability's queue timeout."""


class JobCancelledError(RuntimeFailure):
    """The job observed a cancellation request (runtime stop or an explicit cancel)."""
