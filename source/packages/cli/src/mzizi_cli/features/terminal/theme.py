"""Colored console output and logging for the developer CLI."""

from __future__ import annotations

import logging
from pathlib import Path

from rich.console import Console
from rich.logging import RichHandler
from rich.theme import Theme

THEME = Theme(
    {
        "ok": "bold green",
        "warn": "bold yellow",
        "bad": "bold red",
        "info": "cyan",
        "dim": "grey58",
        "accent": "bold magenta",
        "cmd": "bold cyan",
    }
)

out = Console(theme=THEME)
err = Console(theme=THEME, stderr=True)

LOGGER_NAME = "mzizi"
log = logging.getLogger(LOGGER_NAME)

_FILE_FORMAT = "%(asctime)s %(levelname)-7s %(name)s: %(message)s"


def configure_logging(*, verbose: bool, log_file: Path | None) -> None:
    """Colored console logging on stderr plus a plain, append-only log file."""
    log.handlers.clear()
    log.setLevel(logging.DEBUG)
    log.propagate = False
    console_handler = RichHandler(
        console=err,
        show_path=False,
        show_time=True,
        omit_repeated_times=False,
        rich_tracebacks=True,
        markup=False,
        log_time_format="[%H:%M:%S]",
    )
    console_handler.setLevel(logging.DEBUG if verbose else logging.WARNING)
    log.addHandler(console_handler)
    if log_file is not None:
        log_file.parent.mkdir(parents=True, exist_ok=True)
        file_handler = logging.FileHandler(log_file, encoding="utf-8")
        file_handler.setFormatter(logging.Formatter(_FILE_FORMAT))
        file_handler.setLevel(logging.DEBUG)
        log.addHandler(file_handler)
