"""Loads the repository-root `.env` (git-ignored) into the process environment without overriding existing variables.

The root `.env` is the only place environment values live. Standard AWS names are accepted as aliases for the S3_* names the store
reads. Values are never printed or logged."""

from __future__ import annotations

import os
from pathlib import Path

ALIASES = {
    "S3_ACCESS_KEY": "AWS_ACCESS_KEY_ID",
    "S3_SECRET_KEY": "AWS_SECRET_ACCESS_KEY",
    "S3_REGION": "AWS_DEFAULT_REGION",
}


def repo_root() -> Path:
    for parent in Path(__file__).resolve().parents:
        if (parent / "seed").is_dir() and (parent / "pyproject.toml").is_file():
            return parent
    return Path.cwd()


def parse_env(text: str) -> dict[str, str]:
    values: dict[str, str] = {}
    lines = iter(text.splitlines())
    for raw in lines:
        line = raw.strip().removeprefix("export ").strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        value = value.strip()
        if value[:1] in "\"'" and not (len(value) > 1 and value.endswith(value[0])):
            quote, parts = value[0], [value[1:]]  # multi-line quoted value (PEM keys)
            for more in lines:
                if more.rstrip().endswith(quote):
                    parts.append(more.rstrip()[:-1])
                    break
                parts.append(more)
            value = "\n".join(parts)
        elif value[:1] in "\"'" and value.endswith(value[0]):
            value = value[1:-1]
        values[key.strip()] = value
    return values


def load_environment(path: Path | None = None) -> None:
    candidate = path or Path(os.environ.get("MZIZI_ENV_FILE") or repo_root() / ".env")
    if candidate.is_file():
        for key, value in parse_env(candidate.read_text(encoding="utf-8")).items():
            os.environ.setdefault(key, value)
    for target, source in ALIASES.items():
        if not os.environ.get(target) and os.environ.get(source):
            os.environ[target] = os.environ[source]
