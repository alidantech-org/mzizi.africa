"""Small constructors so extractors state a diagnostic in one line."""

from __future__ import annotations

from mzizi_extraction.core.models import Code, Diagnostic, Level, Locator, Output, Status


def info(code: Code, message: str, locator: Locator | None = None) -> Diagnostic:
    return Diagnostic(level=Level.INFO, code=code, message=message, locator=locator)


def warning(code: Code, message: str, locator: Locator | None = None) -> Diagnostic:
    return Diagnostic(level=Level.WARNING, code=code, message=message, locator=locator)


def error(code: Code, message: str, locator: Locator | None = None) -> Diagnostic:
    return Diagnostic(level=Level.ERROR, code=code, message=message, locator=locator)


def failed(*diagnostics: Diagnostic) -> Output:
    """A failed result carrying only diagnostics."""
    return Output(status=Status.FAILED, diagnostics=diagnostics)
