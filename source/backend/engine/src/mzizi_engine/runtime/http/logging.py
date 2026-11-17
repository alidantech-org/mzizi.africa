"""Readable, coloured engine logs: a time, a coloured level, and one line per request with a coloured status."""

from __future__ import annotations

import os

type LogConfig = dict[str, object]


def _colours() -> bool:
    """Colour unless NO_COLOR is set; the dev runner pipes output, so a terminal check would always say no."""
    return "NO_COLOR" not in os.environ


def log_config() -> LogConfig:
    colour = _colours()
    return {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "default": {
                "()": "uvicorn.logging.DefaultFormatter",
                "fmt": "%(asctime)s %(levelprefix)s %(message)s",
                "datefmt": "%H:%M:%S",
                "use_colors": colour,
            },
            "access": {
                "()": "uvicorn.logging.AccessFormatter",
                "fmt": "%(asctime)s %(levelprefix)s %(client_addr)s  %(request_line)s  %(status_code)s",
                "datefmt": "%H:%M:%S",
                "use_colors": colour,
            },
        },
        "handlers": {
            "default": {"formatter": "default", "class": "logging.StreamHandler", "stream": "ext://sys.stdout"},
            "access": {"formatter": "access", "class": "logging.StreamHandler", "stream": "ext://sys.stdout"},
        },
        "loggers": {
            "uvicorn": {"handlers": ["default"], "level": "INFO", "propagate": False},
            "uvicorn.error": {"level": "INFO"},
            "uvicorn.access": {"handlers": ["access"], "level": "INFO", "propagate": False},
        },
    }
