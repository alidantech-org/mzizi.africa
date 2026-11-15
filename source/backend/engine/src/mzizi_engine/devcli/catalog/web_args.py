"""Shared arguments for website acquisition and browser commands."""

from dataclasses import replace

from mzizi_engine.devcli.catalog.models import Arg, ArgKind

URL = Arg("url", ArgKind.URL, "Page or endpoint URL", positional=True)
RENDER_AUTO = Arg(
    "render",
    ArgKind.CHOICE,
    "How to load pages: auto (HTTP, a browser only when a page needs one), browser, or http",
    choices=("auto", "http", "browser"),
    optional=True,
    default="auto",
)
RENDER = Arg(
    "render",
    ArgKind.CHOICE,
    "How to load pages (dev default: browser; use http to disable)",
    choices=("http", "browser"),
    optional=True,
    default="browser",
)
ADAPTER = Arg(
    "adapter",
    ArgKind.CHOICE,
    "Browser driver (dev default: patchright)",
    choices=("playwright", "patchright"),
    optional=True,
)
HEADLESS = Arg("headless", ArgKind.FLAG, "Hide the browser window (dev mode shows it by default)")
CSS_IMAGES = Arg("css-images", ArgKind.FLAG, "Include inline CSS background image references in Markdown")
RENDERED_MEDIA = Arg("rendered-media", ArgKind.FLAG, "Inventory rendered CSS and responsive images (browser only)")
ACTIONS = Arg("actions", ArgKind.FILE, "YAML or JSON list of steps", suffixes=(".yaml", ".yml", ".json"))
TARGET = Arg("target", ArgKind.TEXT, "CSS selector, or text=Visible label")


CRAWL_ARGS: tuple[Arg, ...] = (
    URL,
    Arg("max-pages", ArgKind.INT, "Page budget", optional=True, default=25),
    Arg("max-depth", ArgKind.INT, "How many links deep to follow", optional=True, default=2),
    Arg("delay", ArgKind.INT, "Seconds between requests to one host", optional=True, default=1),
    replace(RENDER_AUTO, default="browser"),
    ADAPTER,
    Arg(
        "on-block",
        ArgKind.CHOICE,
        "Response to blocks and challenges",
        choices=("backoff", "skip", "stop", "pause"),
        optional=True,
        default="backoff",
    ),
    Arg("allowed-hosts", ArgKind.TEXT, "Extra hosts that count as the site (comma separated)", optional=True),
    Arg("allowed-paths", ArgKind.TEXT, "Only these path prefixes (comma separated)", optional=True),
    Arg("excluded-paths", ArgKind.TEXT, "Never these path prefixes (comma separated)", optional=True),
    HEADLESS,
    Arg("include-subdomains", ArgKind.FLAG, "Treat subdomains as the same site"),
    Arg("no-sitemap", ArgKind.FLAG, "Do not read sitemaps"),
    Arg("no-markdown", ArgKind.FLAG, "Skip the Markdown conversion"),
    Arg("inspect-resources", ArgKind.FLAG, "HEAD internal files and images for type and status"),
    Arg("no-paginate", ArgKind.FLAG, "Do not follow pagination (next links, next buttons, load more, infinite scroll)"),
    Arg("max-list-pages", ArgKind.INT, "Pages per listing to walk", optional=True, default=25),
    Arg("screenshots", ArgKind.FLAG, "Save a full-page screenshot of every crawled page (browser render)"),
    Arg("jsonl", ArgKind.FLAG, "Also write JSON Lines"),
)
