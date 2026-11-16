"""The CLI's parsing boundary: a JSON payload file becomes a typed payload or a clear error."""

from __future__ import annotations

import json

from mzizi_engine.jsonvalue import Payload


def parse_payload(text: str) -> Payload:
    """A JSON object, as the operation payload. Anything else (a list, text, invalid JSON) is a `ValueError`."""
    try:
        value: object = json.loads(text)
    except json.JSONDecodeError as problem:
        raise ValueError(f"the payload is not valid JSON: {problem.msg} at line {problem.lineno}") from problem
    if not isinstance(value, dict):
        raise ValueError("the payload must be a JSON object")
    return {str(key): item for key, item in value.items()}
