"""Payload builders: CLI values to the JSON payload of a capability."""

from __future__ import annotations

import base64
import os
from pathlib import Path

from mzizi_engine.devcli.errors import CliError
from mzizi_engine.devcli.types import ArgValues
from mzizi_engine.devcli.workspace import Workspace
from mzizi_engine.jsonvalue import JsonValue, Payload
from mzizi_engine.web.crawl.inventory import CrawlSummary

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


def scrape_payload(values: ArgValues, ws: Workspace) -> Payload:
    payload = passthrough(values, ws)
    raw = payload.pop("input", None)
    if isinstance(raw, str):
        payload["source"] = raw
        payload["html_base64"] = base64.b64encode(Path(raw).read_bytes()).decode("ascii")
    manifest = payload.pop("manifest", None)
    if isinstance(manifest, str):
        payload["module_yaml"] = Path(manifest).read_bytes().decode("utf-8")
        payload["module_source"] = manifest
    return payload


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
    payload: Payload = {
        "resume_from": str(Path(folder).expanduser().resolve()),
        "max_pages": values.get("max-pages") or 25,
    }
    seed = Path(folder) / "summary.json"
    if seed.exists():
        summary = CrawlSummary.model_validate_json(seed.read_bytes())
        payload.update(
            url=summary.start_urls[0] if summary.start_urls else "",
            render=summary.render.value,
            adapter=summary.adapter,
        )
    return payload


def run_source_payload(values: ArgValues, ws: Workspace) -> Payload:
    """`--run` is a run name (or `last`) in the dev runs, or the path of any run folder."""
    raw = values.get("run")
    if not isinstance(raw, str):
        raise CliError("--run is required")
    direct = Path(raw).expanduser()
    folder = direct.resolve() if direct.is_dir() else ws.run_folder(raw)
    if folder is None:
        raise CliError(f"no run folder {raw!r}", hint="see `mzizi dev runs`")
    payload = passthrough({k: v for k, v in values.items() if k != "run"}, ws)
    payload["source"] = str(folder)
    return payload


DEV_BROWSER_ADAPTER = "patchright"
DEV_BROWSER_ENV = "MZIZI_DEV_BROWSER"  # set to "headless" for CI and tests: no window, no shared browser


def with_dev_browser_defaults(payload: Payload, *, uses_browser: bool) -> Payload:
    """Dev mode opens one persistent, visible Patchright window (reused by later commands) unless `--adapter` or `--headless` says otherwise."""
    browsing = uses_browser and (payload.get("render", "browser") == "browser")
    if not browsing:
        return payload
    headless = bool(payload.pop("headless", False)) or os.environ.get(DEV_BROWSER_ENV) == "headless"
    payload.setdefault("adapter", DEV_BROWSER_ADAPTER)
    payload["headed"] = not headless
    payload["reuse_browser"] = not headless  # one persistent window and tab for the whole dev session
    return payload
