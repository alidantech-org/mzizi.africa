"""CLI failures with a distinct exit code and an explanation the user can act on."""

from __future__ import annotations

from mzizi_engine.devcli.types import ExitCode


class CliError(Exception):
    exit_code: ExitCode = ExitCode.FAILED

    def __init__(self, message: str, *, hint: str | None = None) -> None:
        super().__init__(message)
        self.message = message
        self.hint = hint


class MissingArgument(CliError):
    """A required value was not given and the session cannot ask for it."""

    exit_code = ExitCode.USAGE


class NotYetAdded(CliError):
    """The command is wired, but its capability has no implementation yet."""

    exit_code = ExitCode.NOT_YET_ADDED


class Unavailable(CliError):
    """The capability exists but a tool, library, service or setting it needs is missing."""

    exit_code = ExitCode.UNAVAILABLE


class Cancelled(CliError):
    exit_code = ExitCode.CANCELLED
