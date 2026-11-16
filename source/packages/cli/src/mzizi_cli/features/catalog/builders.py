"""Payload builders: CLI values to the JSON payload of a capability."""

from __future__ import annotations

import base64
import os
from pathlib import Path

from mzizi_cli.shared.errors import CliError
from mzizi_cli.shared.types import ArgValues
from mzizi_cli.shared.workspace import RunRecord, Workspace
from mzizi_crawler.shared.engine.inventory import CrawlSummary
from mzizi_crawler.shared.engine.state import CrawlState
from mzizi_crawler.shared.requests import CrawlRequest
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
    if values.get("strict-table-lines"):
        payload["strict_table_lines"] = True
    if values.get("auto-tables"):
        payload["auto_tables"] = True
    for key in ("first-page", "last-page"):
        value = values.get(key)
        if value is not None:
            payload[key.replace("-", "_")] = value
    schema = values.get("table-schema")
    if isinstance(schema, str):
        payload["table_schema_json"] = Path(schema).read_text(encoding="utf-8")
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
    if payload.pop("no_paginate", False):
        payload["paginate"] = False
    if payload.pop("no_download", False):
        payload["download"] = False
    if payload.pop("no_hunt", False):
        payload["hunt"] = False
    if payload.pop("no_markdown", False):
        payload["markdown"] = False
    if payload.pop("jsonl", False):
        payload["formats"] = ["csv", "json", "jsonl"]
    return payload


def resume_payload(values: ArgValues, ws: Workspace) -> Payload:
    folder = values.get("folder")
    if not isinstance(folder, str):
        raise CliError("--folder is required")
    root = Path(folder).expanduser().resolve()
    payload: Payload = {}
    state_file, run_file = root / "state.json", root / "run.json"
    state = CrawlState.model_validate_json(state_file.read_bytes()) if state_file.exists() else None
    if state is not None and state.request is not None:
        payload.update(state.request.model_dump(mode="json"))
    elif run_file.exists():
        record = RunRecord.model_validate_json(run_file.read_bytes())
        restored: ArgValues = {
            key: True if value == "True" else False if value == "False" else value
            for key, value in record.arguments.items()
        }
        payload.update(with_dev_browser_defaults(crawl_payload(restored, ws), uses_browser=True))
        payload["profile_dir"] = str(ws.browser_profile)
        payload["out_dir"] = str(root)
        # Validate restored argument types before returning the engine payload.
        payload = CrawlRequest.model_validate(payload, strict=False).model_dump(mode="json")
    elif (root / "summary.json").exists():
        summary = CrawlSummary.model_validate_json((root / "summary.json").read_bytes())
        payload.update(
            url=summary.start_urls[0] if summary.start_urls else "",
            urls=list(summary.start_urls[1:]),
            render=summary.render.value,
            adapter=summary.adapter,
            rendered_media=summary.rendered_media,
            references_only=summary.references_only,
            listing_selector=summary.listing_selector,
            item_selector=summary.item_selector,
        )
    payload.update(resume_from=str(root), max_pages=values.get("max-pages") or 25)
    if values.get("css-images"):
        payload["css_images"] = True
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
    browsing = uses_browser and (payload.get("render", "browser") in ("browser", "auto"))
    if not browsing:
        return payload
    headless = bool(payload.pop("headless", False)) or os.environ.get(DEV_BROWSER_ENV) == "headless"
    payload.setdefault("adapter", DEV_BROWSER_ADAPTER)
    payload["headed"] = not headless
    payload["reuse_browser"] = not headless  # one persistent window and tab for the whole dev session
    return payload
