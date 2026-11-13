"""Commands for live web access: fetch, web, download, browser and search."""

from __future__ import annotations

from mzizi_engine.devcli.catalog.builders import crawl_payload, passthrough, resume_payload, scrape_payload
from mzizi_engine.devcli.catalog.models import Arg, ArgKind, Command

URL = Arg("url", ArgKind.URL, "Page or endpoint URL", positional=True)
RENDER = Arg("render", ArgKind.CHOICE, "How to load pages", choices=("http", "browser"), optional=True, default="http")
ADAPTER = Arg("adapter", ArgKind.CHOICE, "Browser driver", choices=("playwright", "patchright"), optional=True)
ACTIONS = Arg("actions", ArgKind.FILE, "YAML or JSON list of steps", suffixes=(".yaml", ".yml", ".json"))
TARGET = Arg("target", ArgKind.TEXT, "CSS selector, or text=Visible label")


def _browser(name: str, help_text: str, *extra: Arg, headed: bool = True) -> Command:
    flag = Arg("headless", ArgKind.FLAG, "No window") if headed else Arg("headed", ArgKind.FLAG, "Show the window")
    return Command(
        "browser", name, help_text, f"browser.{name}", (URL, *extra, flag, ADAPTER), passthrough, run_folder=True
    )


CRAWL_ARGS: tuple[Arg, ...] = (
    URL,
    Arg("max-pages", ArgKind.INT, "Page budget", optional=True, default=25),
    Arg("max-depth", ArgKind.INT, "How many links deep to follow", optional=True, default=2),
    Arg("delay", ArgKind.INT, "Seconds between requests to one host", optional=True, default=1),
    RENDER,
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
    Arg("headed", ArgKind.FLAG, "Show the browser window (needed for --on-block pause)"),
    Arg("include-subdomains", ArgKind.FLAG, "Treat subdomains as the same site"),
    Arg("no-sitemap", ArgKind.FLAG, "Do not read sitemaps"),
    Arg("no-markdown", ArgKind.FLAG, "Skip the Markdown conversion"),
    Arg("inspect-resources", ArgKind.FLAG, "HEAD internal files and images for type and status"),
    Arg("jsonl", ArgKind.FLAG, "Also write JSON Lines"),
)

COMMANDS: tuple[Command, ...] = (
    Command(
        "fetch",
        "url",
        "One identified, policy-checked request; saves the body",
        "fetch.url",
        (URL,),
        passthrough,
        run_folder=True,
    ),
    Command(
        "fetch",
        "robots",
        "The recorded robots.txt decision for a URL",
        "fetch.robots",
        (URL,),
        passthrough,
        run_folder=True,
    ),
    Command(
        "fetch",
        "policy",
        "Show the effective fetch policy of a manifest",
        "fetch.policy",
        (Arg("manifest", ArgKind.FILE, "Manifest with a policy block", suffixes=(".yaml", ".yml")),),
        passthrough,
    ),
    Command(
        "web",
        "links",
        "Every link, image, media and embed URL on one page, classified",
        "web.links",
        (URL,),
        passthrough,
        run_folder=True,
    ),
    Command(
        "web",
        "challenge",
        "Does this URL or saved page show an access challenge? (detection only)",
        "scraping.challenge",
        (
            Arg("url", ArgKind.URL, "Page URL", positional=True, optional=True),
            Arg("actions", ArgKind.FILE, "Or a saved HTML page", optional=True, suffixes=(".html", ".htm")),
        ),
        passthrough,
        run_folder=True,
    ),
    Command(
        "scrape",
        "url",
        "Apply a site module to one fetched or rendered HTML page",
        "scraping.url",
        (
            URL,
            Arg("manifest", ArgKind.FILE, "Site module YAML", suffixes=(".yaml", ".yml")),
            RENDER,
            ADAPTER,
            Arg("headed", ArgKind.FLAG, "Show the browser window"),
        ),
        scrape_payload,
        run_folder=True,
    ),
    Command(
        "web",
        "markdown",
        "One page to Markdown, without header, footer and navigation",
        "scraping.markdown",
        (URL, RENDER, ADAPTER, Arg("headed", ArgKind.FLAG, "Show the browser window")),
        passthrough,
        run_folder=True,
    ),
    Command(
        "web",
        "crawl",
        "Crawl in-scope pages and inventory links, resources, external hosts and Markdown",
        "scraping.crawl",
        CRAWL_ARGS,
        crawl_payload,
        run_folder=True,
    ),
    Command(
        "web",
        "resume",
        "Continue an interrupted crawl from its output folder",
        "scraping.crawl",
        (
            Arg("folder", ArgKind.FOLDER, "Crawl output folder", positional=True),
            Arg("max-pages", ArgKind.INT, "Page budget", optional=True, default=25),
        ),
        resume_payload,
        run_folder=True,
    ),
    Command(
        "web",
        "export",
        "Re-export a crawl's inventories as CSV, JSON or JSON Lines",
        "web.export",
        (Arg("source", ArgKind.FOLDER, "Crawl output folder", positional=True),),
        passthrough,
        run_folder=True,
    ),
    Command(
        "download",
        "get",
        "Download one file safely (any host; slow, hashed, resumable)",
        "web.download",
        (
            URL,
            Arg("background", ArgKind.FLAG, "Run detached and return at once"),
            Arg("limit-rate", ArgKind.INT, "Maximum KiB per second", optional=True),
            Arg("allow-private", ArgKind.FLAG, "Allow local or private addresses"),
        ),
        passthrough,
        run_folder=True,
    ),
    Command(
        "download",
        "many",
        "Download every URL in a crawl's files.csv or documents.csv",
        "web.download",
        (
            Arg(
                "from-file", ArgKind.FILE, "CSV or JSON list from a crawl", positional=True, suffixes=(".csv", ".json")
            ),
            Arg("limit-rate", ArgKind.INT, "Maximum KiB per second", optional=True),
            Arg("concurrency", ArgKind.INT, "Parallel downloads", optional=True, default=2),
            Arg("background", ArgKind.FLAG, "Run detached"),
        ),
        passthrough,
        run_folder=True,
    ),
    Command(
        "download", "status", "Progress and results of downloads", "web.downloads", (), passthrough, run_folder=True
    ),
    _browser(
        "open",
        "Open a URL in Chromium and report what rendered",
        Arg("hold", ArgKind.FLAG, "Keep it open until you press Enter"),
    ),
    _browser("snapshot", "Rendered HTML and a screenshot", headed=False),
    _browser("navigate", "Run clicks, typing, scrolling and waits from a script", ACTIONS),
    _browser("click", "Open a page, click one element, report the result", TARGET),
    _browser("fill", "Open a page and fill one field", TARGET, Arg("text", ArgKind.TEXT, "Text to enter")),
    _browser("compare", "HTTP result versus browser result: does this page need a browser?", headed=False),
    Command(
        "search",
        "web",
        "Search through the official Brave or Google API",
        "search.web",
        (
            Arg("query", ArgKind.TEXT, "What to search for", positional=True),
            Arg("engine", ArgKind.CHOICE, "Provider", choices=("brave", "google"), optional=True, default="brave"),
            Arg("count", ArgKind.INT, "Results", optional=True, default=10),
            Arg("offset", ArgKind.INT, "Start at result", optional=True, default=0),
        ),
        passthrough,
        run_folder=True,
    ),
)
