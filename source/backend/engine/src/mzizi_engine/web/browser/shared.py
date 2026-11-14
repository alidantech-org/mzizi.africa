"""A long-lived dev browser that commands attach to over CDP instead of launching and closing their own."""

from __future__ import annotations

import fcntl
import importlib
import json
import os
import signal
import socket
import subprocess
import time
import urllib.request
from pathlib import Path

from pydantic import BaseModel, ConfigDict

from mzizi_engine.web.browser.adapter import BrowserUnavailable, discover_chrome

STATE_FILE = "shared-browser.json"
LOCK_FILE = "shared-browser.lock"
START_TIMEOUT = 15.0


class SharedBrowser(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    adapter: str
    pid: int
    port: int

    @property
    def cdp_url(self) -> str:
        return f"http://127.0.0.1:{self.port}"


def _alive(port: int) -> bool:
    try:
        with urllib.request.urlopen(f"http://127.0.0.1:{port}/json/version", timeout=1):
            return True
    except OSError:
        return False


def _free_port() -> int:
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        return int(sock.getsockname()[1])


def _executable(adapter: str) -> str:
    if adapter == "patchright":
        try:
            sync_api = importlib.import_module("patchright.sync_api")
        except ModuleNotFoundError as problem:
            raise BrowserUnavailable("patchright is not installed: run `uv sync --all-packages --extra browser`") from problem
        with sync_api.sync_playwright() as driver:
            path = str(driver.chromium.executable_path)
        if not Path(path).is_file():
            raise BrowserUnavailable("run `uv run --package mzizi-engine --extra browser patchright install chromium`")
        return path
    found = discover_chrome()
    if found is None:
        raise BrowserUnavailable("no Chrome or Chromium found for the playwright adapter")
    return found


def read_state(folder: Path) -> SharedBrowser | None:
    path = folder / STATE_FILE
    if not path.is_file():
        return None
    try:
        state = SharedBrowser.model_validate(json.loads(path.read_text(encoding="utf-8")))
    except ValueError:
        return None
    return state if _alive(state.port) else None


def ensure_shared_browser(folder: Path, adapter: str, profile_dir: Path, user_agent: str) -> SharedBrowser:
    """Returns the running dev browser, starting a visible one (detached, own profile) when none is alive."""
    folder.mkdir(parents=True, exist_ok=True)
    with (folder / LOCK_FILE).open("w") as lock:  # one starter at a time: concurrent commands never open a second window
        fcntl.flock(lock, fcntl.LOCK_EX)
        return _ensure_locked(folder, adapter, profile_dir, user_agent)


def _ensure_locked(folder: Path, adapter: str, profile_dir: Path, user_agent: str) -> SharedBrowser:
    existing = read_state(folder)
    if existing is not None and existing.adapter == adapter:
        return existing
    if existing is not None:
        stop_shared_browser(folder)
    profile_dir.mkdir(parents=True, exist_ok=True)
    port = _free_port()
    process = subprocess.Popen(
        [
            _executable(adapter),
            f"--remote-debugging-port={port}",
            f"--user-data-dir={profile_dir}",
            f"--user-agent={user_agent}",
            "--disable-backgrounding-occluded-windows",  # a window behind others must still paint, or screenshots stall
            "--disable-renderer-backgrounding",
            "--disable-background-timer-throttling",
            "--no-first-run",
            "--no-default-browser-check",
            "about:blank",
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        start_new_session=True,
    )
    deadline = time.monotonic() + START_TIMEOUT
    while time.monotonic() < deadline and not _alive(port):
        time.sleep(0.2)
    if not _alive(port):
        process.terminate()
        raise BrowserUnavailable("the shared browser did not start; is a display available (DISPLAY/WAYLAND_DISPLAY)?")
    state = SharedBrowser(adapter=adapter, pid=process.pid, port=port)
    (folder / STATE_FILE).write_text(state.model_dump_json(), encoding="utf-8")
    return state


def stop_shared_browser(folder: Path) -> bool:
    path = folder / STATE_FILE
    if not path.is_file():
        return False
    try:
        state = SharedBrowser.model_validate(json.loads(path.read_text(encoding="utf-8")))
        os.kill(state.pid, signal.SIGTERM)
    except (ValueError, ProcessLookupError, PermissionError):
        pass
    path.unlink(missing_ok=True)
    return True
