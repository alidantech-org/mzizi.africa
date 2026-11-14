"""Commands for live web access: fetch, web, download, browser and search."""

from __future__ import annotations

from mzizi_engine.devcli.catalog.builders import crawl_payload, passthrough, resume_payload, scrape_payload
from mzizi_engine.devcli.catalog.models import Arg, ArgKind, Command

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
ACTIONS = Arg("actions", ArgKind.FILE, "YAML or JSON list of steps", suffixes=(".yaml", ".yml", ".json"))
TARGET = Arg("target", ArgKind.TEXT, "CSS selector, or text=Visible label")


def _browser(name: str, help_text: str, *extra: Arg, headed: bool = True) -> Command:
    return Command(
        "browser", name, help_text, f"browser.{name}", (URL, *extra, HEADLESS, ADAPTER), passthrough, run_folder=True
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
            HEADLESS,
        ),
        scrape_payload,
        run_folder=True,
    ),
    Command(
        "web",
        "markdown",
        "One page to Markdown, without header, footer and navigation",
        "scraping.markdown",
        (URL, RENDER, ADAPTER, HEADLESS),
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
    Command("web", "survey", "Crawl a site, profile it and draft a site structure", "web.survey", CRAWL_ARGS, crawl_payload, run_folder=True),
    Command(
        "web",
        "profile",
        "Profile a crawl run folder: sections, templates, navigation, repeated blocks",
        "web.profile",
        (Arg("source", ArgKind.TEXT, "Crawl run folder"),),
        passthrough,
        run_folder=True,
    ),
    Command(
        "web",
        "family",
        "Do two crawled sites share a template? Similarity and the varying host part",
        "web.family",
        (Arg("left", ArgKind.TEXT, "First crawl run folder"), Arg("right", ArgKind.TEXT, "Second crawl run folder")),
        passthrough,
        run_folder=True,
    ),
    Command(
        "web",
        "draft",
        "Draft a site structure bundle from a crawl run folder",
        "web.draft",
        (Arg("source", ArgKind.TEXT, "Crawl run folder"), Arg("site", ArgKind.TEXT, "Site code", optional=True)),
        passthrough,
        run_folder=True,
    ),
    Command(
        "web",
        "rank",
        "Rank downloaded files (catalog.json) against Mzizi targets using ranking.yml rules",
        "web.rank",
        (
            Arg("source", ArgKind.TEXT, "Downloads folder with catalog.json"),
            Arg("rules", ArgKind.FILE, "ranking.yml", suffixes=(".yml", ".yaml")),
            Arg("record", ArgKind.CHOICE, "Where scores go", choices=("auto", "ledger"), optional=True, default="auto"),
        ),
        passthrough,
        run_folder=True,
    ),
    Command(
        "download",
        "enqueue",
        "Queue every document, image, media and file in a site's inventory (state kept in MongoDB)",
        "download.enqueue",
        (Arg("site", ArgKind.URL, "Site URL or host", positional=True),),
        passthrough,
        run_folder=True,
    ),
    Command(
        "download",
        "run",
        "Download queued items; each is tracked in MongoDB",
        "download.run",
        (Arg("site", ArgKind.URL, "Site URL or host", positional=True), Arg("limit", ArgKind.INT, "Items to take", optional=True, default=100)),
        passthrough,
        run_folder=True,
    ),
    Command("download", "queue", "Counts per state, and recent failures", "download.queue", (Arg("site", ArgKind.URL, "Site URL or host", optional=True, positional=True),), passthrough, run_folder=True),
    Command(
        "site",
        "watch",
        "Crawl a site by URL, keep hashed versioned pages, hunt and download its files, report what changed",
        "site.watch",
        (
            *(RENDER_AUTO if arg.name == "render" else arg for arg in CRAWL_ARGS),
            Arg("no-download", ArgKind.FLAG, "Do not download the files found"),
            Arg("no-hunt", ArgKind.FLAG, "Do not hunt for probable downloads or a CMS media library"),
            Arg("download-limit", ArgKind.INT, "Files to download per run", optional=True, default=200),
            Arg("min-age-hours", ArgKind.INT, "Do not fetch again a page fetched less than this many hours ago", optional=True, default=12),
        ),
        crawl_payload,
        run_folder=True,
    ),
    Command(
        "web",
        "diff",
        "Compare two crawl run folders: pages added, removed and changed",
        "web.diff",
        (
            Arg("baseline", ArgKind.TEXT, "Earlier crawl run folder"),
            Arg("current", ArgKind.TEXT, "Later crawl run folder"),
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
    Command(
        "browser", "start", "Open the one shared dev browser window", "browser.start", (ADAPTER,), passthrough, run_folder=True
    ),
    Command("browser", "stop", "Close the shared dev browser window", "browser.stop", (), passthrough, run_folder=True),
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
