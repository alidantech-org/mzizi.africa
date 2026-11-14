"""What every web handler shares: the capability wrapper, identity, browser configuration."""

from __future__ import annotations

from collections.abc import Callable
from pathlib import Path

from pydantic import BaseModel

from mzizi_engine.jsonvalue import Payload
from mzizi_engine.web.browser.adapter import check_profile
from mzizi_engine.web.browser.models import BrowserConfig
from mzizi_engine.web.browser.shared import ensure_shared_browser
from mzizi_engine.layout import host_of
from mzizi_engine.web.identity import user_agent
from mzizi_engine.web.requests import Workspace

DEFAULT_PROFILES = ("browser", "profiles")


def capability[R: BaseModel](model: type[R], run: Callable[[R], BaseModel]) -> Callable[[Payload], Payload]:
    """Wraps a typed function as an engine capability: the payload is parsed once, here, and the result is serialised."""

    def handler(payload: Payload) -> Payload:
        return run(model.model_validate(payload, strict=False)).model_dump(mode="json")

    handler.__name__ = run.__name__
    return handler


def out_dir(request: Workspace) -> Path:
    folder = Path(request.out_dir)
    folder.mkdir(parents=True, exist_ok=True)
    return folder


def profiles_root(request: Workspace) -> Path:
    """The folder holding one profile per browser driver; the shared window's state sits beside it."""
    return Path(request.profile_dir) if request.profile_dir else out_dir(request).joinpath(*DEFAULT_PROFILES)


def site_of(url: str) -> str:
    """The host a browser session works on (its tab key); empty when there is no URL."""
    return host_of(url) if url else ""


def browser_config(
    request: Workspace, *, headed: bool, agent: str | None = None, site: str = ""
) -> BrowserConfig:
    folder = out_dir(request)
    root = profiles_root(request)
    check_profile(root)
    cdp_url = None
    if request.reuse_browser and headed:
        profile = root / request.adapter  # the shared window's profile
        shared = ensure_shared_browser(root.parent, request.adapter, profile, agent or user_agent())
        cdp_url = shared.cdp_url
    else:
        profile = root / f"{request.adapter}-headless"
    return BrowserConfig(
        site=site if cdp_url else "",
        registry_dir=root.parent,
        cdp_url=cdp_url,
        adapter=request.adapter,
        headed=headed,
        profile_dir=profile,
        downloads_dir=Path(request.downloads_dir) if request.downloads_dir else folder / "downloads",
        screenshots_dir=folder / "screenshots",
        user_agent=agent or user_agent(),
    )
