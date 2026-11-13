"""Payload builders: CLI values to the JSON payload of a capability."""

from __future__ import annotations

import base64
from pathlib import Path

from mzizi_engine.devcli.errors import CliError
from mzizi_engine.devcli.types import ArgValues
from mzizi_engine.devcli.workspace import Workspace
from mzizi_engine.jsonvalue import JsonValue, Payload

LIST_ARGUMENTS = frozenset({"allowed-hosts", "allowed-paths", "excluded-paths", "urls"})


def file_payload(values: ArgValues, ws: Workspace, key: str = "input") -> Payload:
    """A file inside the workspace inputs is passed by path; any other file is read here and passed as bytes."""
    raw = values.get(key)
    if not isinstance(raw, str):
        raise CliError(f"--{key} is required")
    path = Path(raw).expanduser().resolve()
    if ws.contains(path):
        return {"path": str(path.relative_to(ws.inputs.resolve()))}
    return {"content_base64": base64.b64encode(path.read_bytes()).decode("ascii")}


def links_payload(values: ArgValues, ws: Workspace) -> Payload:
    raw, base = values.get("input"), values.get("base-url")
    if not isinstance(raw, str) or not isinstance(base, str):
        raise CliError("--input and --base-url are required")
    return {"html": Path(raw).expanduser().read_text(encoding="utf-8", errors="replace"), "base_url": base}


def directory_payload(values: ArgValues, ws: Workspace) -> Payload:
    raw = values.get("directory")
    if not isinstance(raw, str):
        raise CliError("--directory is required")
    return {"directory": str(Path(raw).expanduser().resolve())}


def markdown_payload(values: ArgValues, ws: Workspace) -> Payload:
    payload = file_payload(values, ws)
    for key in ("ocr", "languages"):
        if values.get(key):
            payload[key] = values[key]
    if values.get("page-renders"):
        payload["page_renders"] = True
    return payload


def no_payload(values: ArgValues, ws: Workspace) -> Payload:
    return {}


def passthrough(values: ArgValues, ws: Workspace) -> Payload:
    """Option names become payload keys (`max-pages` to `max_pages`); comma-separated list options become lists."""
    payload: Payload = {}
    for key, value in values.items():
        if value is None or value is False:
            continue
        converted: JsonValue = (
            [part.strip() for part in value.split(",") if part.strip()]
            if key in LIST_ARGUMENTS and isinstance(value, str)
            else value
        )
        payload[key.replace("-", "_")] = converted
    return payload


def crawl_payload(values: ArgValues, ws: Workspace) -> Payload:
    payload = passthrough(values, ws)
    if payload.pop("no_sitemap", False):
        payload["sitemap"] = False
    if payload.pop("no_markdown", False):
        payload["markdown"] = False
    if payload.pop("jsonl", False):
        payload["formats"] = ["csv", "json", "jsonl"]
    return payload


def resume_payload(values: ArgValues, ws: Workspace) -> Payload:
    folder = values.get("folder")
    if not isinstance(folder, str):
        raise CliError("--folder is required")
    first = ""
    seed = Path(folder) / "summary.json"
    if seed.exists():
        import json

        urls = json.loads(seed.read_text(encoding="utf-8")).get("start_urls", [])
        first = urls[0] if urls else ""
    return {
        "resume_from": str(Path(folder).expanduser().resolve()),
        "url": first,
        "max_pages": values.get("max-pages") or 25,
    }
