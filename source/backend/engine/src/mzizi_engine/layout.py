"""Where everything the engine keeps lives under `.dev/`. One module owns every path; nothing else builds one.

    websites/<suffix labels reversed>/<registrable label>/<host label>/
      scraped/  pages/<path>/  files/<type>/   what was fetched
      extracted/<type>/<name>/                 what was built from files
      drafts/                                  site profile and bundle drafts
    runs/<date>/<time>-<command>/              one-off commands
    browser/  logs/  cache/  inputs/  secure/  stack/

For `kasarani.ngcdf.go.ke`: `websites/ke/go/ngcdf/kasarani/`. The apex host is `_root`; `www` is its own folder.
Folders are created on first write, never in advance.
"""

from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path
from urllib.parse import urlparse

import tldextract
from pydantic import BaseModel, ConfigDict

from mzizi_engine.names import page_slug, slug

WORKSPACE_ENV = "MZIZI_DEV_ROOT"
APEX = "_root"
UNSORTED = "_other"
TYPES = ("pdf", "document", "data", "image", "media", "archive", "other")


class SiteAddress(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    host: str
    group: tuple[str, ...]  # reversed public suffix, then the registrable label
    label: str  # the subdomain, `www`, or `_root` for the apex

    @property
    def parts(self) -> tuple[str, ...]:
        return (*self.group, self.label)


@lru_cache(maxsize=1)
def _extractor() -> tldextract.TLDExtract:
    # bundled public-suffix snapshot only: no network, no cache folder
    return tldextract.TLDExtract(suffix_list_urls=(), cache_dir=None)


def host_of(url_or_host: str) -> str:
    parsed = urlparse(url_or_host if "//" in url_or_host else f"//{url_or_host}")
    return (parsed.hostname or "").lower()


def address_of(url_or_host: str) -> SiteAddress:
    host = host_of(url_or_host)
    found = _extractor()(host)
    if not found.suffix or not found.domain:  # an IP address, `localhost`, an unknown suffix
        return SiteAddress(host=host, group=(UNSORTED,), label=slug(host, 80))
    suffix = tuple(reversed(found.suffix.split(".")))
    return SiteAddress(
        host=host,
        group=(*suffix, slug(found.domain, 60)),
        label=slug(found.subdomain, 60) if found.subdomain else APEX,
    )


class SiteFolder:
    def __init__(self, root: Path, address: SiteAddress) -> None:
        self.root, self.address = root, address

    @property
    def visited_file(self) -> Path:
        return self.root / "visited.txt"

    @property
    def inventory(self) -> Path:
        return self.root / "inventory"

    @property
    def pages(self) -> Path:
        return self.root / "pages"

    def page(self, path: str) -> Path:
        """`pages/<path segments>/`; the root page is `pages/index/`."""
        segments = [slug(s, 60) for s in path.split("?")[0].split("/") if s]
        if segments and Path(segments[-1]).suffix in (".html", ".htm"):
            segments[-1] = Path(segments[-1]).stem
        return self.pages.joinpath(*(segments or ["index"]))

    def page_slug(self, path: str, query: str = "") -> str:
        return page_slug(path, query)

    def files(self, kind: str) -> Path:
        return self.root / "scraped" / "files" / (kind if kind in TYPES else "other")

    def extracted(self, kind: str, name: str) -> Path:
        return self.root / "extracted" / kind / name

    @property
    def drafts(self) -> Path:
        return self.root / "drafts"


class DevLayout:
    def __init__(self, root: Path) -> None:
        self.root = root

    @classmethod
    def locate(cls, cwd: Path | None = None) -> DevLayout:
        override = os.environ.get(WORKSPACE_ENV)
        if override:
            return cls(Path(override).expanduser().resolve())
        start = (cwd or Path.cwd()).resolve()
        for candidate in (start, *start.parents):
            if (candidate / ".git").exists() and (candidate / "pyproject.toml").exists():
                return cls(candidate / ".dev")
        return cls(start / ".dev")

    def website(self, url_or_host: str) -> SiteFolder:
        address = address_of(url_or_host)
        return SiteFolder(self.root.joinpath("websites", *address.parts), address)

    @property
    def browser(self) -> Path:
        return self.root / "browser"

    @property
    def inputs(self) -> Path:
        return self.root / "inputs"

    @property
    def runs(self) -> Path:
        return self.root / "runs"
