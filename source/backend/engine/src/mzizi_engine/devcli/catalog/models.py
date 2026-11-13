"""What a CLI command is: arguments, the port it drives and how its payload is built."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from enum import Enum

from mzizi_engine.devcli.types import ArgValues
from mzizi_engine.devcli.workspace import Workspace
from mzizi_engine.jsonvalue import Payload


class ArgKind(str, Enum):
    FILE = "file"
    FOLDER = "folder"
    URL = "url"
    TEXT = "text"
    CHOICE = "choice"
    INT = "int"
    RUN = "run"
    FLAG = "flag"


@dataclass(frozen=True)
class Arg:
    name: str
    kind: ArgKind
    help: str
    choices: tuple[str, ...] = ()
    optional: bool = False
    positional: bool = False
    suffixes: tuple[str, ...] = ()
    default: str | int | None = None


type PayloadBuilder = Callable[[ArgValues, Workspace], Payload]


@dataclass(frozen=True)
class Command:
    group: str
    name: str
    help: str
    port: str | None
    args: tuple[Arg, ...] = ()
    builder: PayloadBuilder | None = None
    artifacts: bool = False
    run_folder: bool = False

    @property
    def path(self) -> str:
        return f"{self.group} {self.name}"


GROUP_HELP: dict[str, str] = {
    "extract": "Extract text, tables and records from local files (mzizi-extraction)",
    "fetch": "Identified, policy-checked HTTP requests (mzizi-fetch)",
    "scrape": "Selectors and links on saved pages (mzizi-scraping)",
    "web": "Inspect, crawl and export websites: links, resources, external hosts, Markdown",
    "download": "Safe, slow, resumable downloads into quarantine",
    "browser": "Drive a real browser: open, click, fill, screenshot, compare with HTTP",
    "search": "Web search through the official Brave and Google APIs",
    "manifest": "Validate and explain manifests and site structures (mzizi-manifest)",
    "fs": "Hash and upload files (mzizi-filesystem)",
    "mongo": "Dev-only MongoDB sandbox",
    "vector": "Dev-only vector database sandbox",
    "dev": "Workspace, runs and dev services",
}
