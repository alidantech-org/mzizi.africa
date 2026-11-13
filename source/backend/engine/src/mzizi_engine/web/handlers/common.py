"""What every web handler shares: the capability wrapper, identity, browser configuration."""

from __future__ import annotations

from collections.abc import Callable
from pathlib import Path

from pydantic import BaseModel

from mzizi_engine.jsonvalue import Payload
from mzizi_engine.web.browser.models import BrowserConfig
from mzizi_engine.web.identity import user_agent
from mzizi_engine.web.requests import Request, Workspace

DEFAULT_PROFILE = "browser-profile"


def capability[R: Request](model: type[R], run: Callable[[R], BaseModel]) -> Callable[[Payload], Payload]:
    """Wraps a typed function as an engine capability: the payload is parsed once, here, and the result is serialised."""

    def handler(payload: Payload) -> Payload:
        return run(model.model_validate(payload, strict=False)).model_dump(mode="json")

    handler.__name__ = run.__name__
    return handler


def out_dir(request: Workspace) -> Path:
    folder = Path(request.out_dir)
    folder.mkdir(parents=True, exist_ok=True)
    return folder


def browser_config(request: Workspace, *, headed: bool, agent: str | None = None) -> BrowserConfig:
    folder = out_dir(request)
    return BrowserConfig(
        headed=headed,
        profile_dir=Path(request.profile_dir) if request.profile_dir else folder / DEFAULT_PROFILE,
        downloads_dir=Path(request.downloads_dir) if request.downloads_dir else folder / "downloads",
        screenshots_dir=folder / "screenshots",
        user_agent=agent or user_agent(),
    )
