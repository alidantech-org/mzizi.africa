"""Ports for web access, browsers, downloads and search."""

from __future__ import annotations

from mzizi_engine.devcli.ports.models import Port, binary, declare, module

BROWSER_LIB = module("playwright", "install the optional browser group: `uv sync --all-packages --extra browser`")
CHROME = binary("google-chrome", "google-chrome-stable", "chromium", hint="install Google Chrome or Chromium")
PKG = "mzizi-engine"

WEB: tuple[Port, ...] = (
    declare("fetch.url", "mzizi-fetch", "One identified, policy-checked request", 3),
    declare("fetch.robots", "mzizi-fetch", "The recorded robots.txt decision for a URL", 3),
    declare("web.links", PKG, "Every link, image, media and embed URL on a page, classified", 3),
    declare("scraping.challenge", "mzizi-scraping", "Detect an access challenge, CAPTCHA or block notice", 3),
    declare("scraping.markdown", "mzizi-extraction", "A page to Markdown without header, footer and navigation", 3),
    declare("scraping.crawl", PKG, "Bounded, resumable site crawl with separate inventories", 3),
    declare("web.export", PKG, "Re-export a crawl's inventories as CSV, JSON or JSON Lines", 3),
    declare("web.download", "mzizi-fetch", "Safe, resumable, throttled downloads into quarantine", 4),
    declare("web.downloads", PKG, "Progress and results of downloads", 4),
    declare("browser.open", PKG, "Open a URL in a real browser", 4, "", BROWSER_LIB, CHROME),
    declare("browser.snapshot", PKG, "Rendered HTML and a screenshot", 4, "", BROWSER_LIB, CHROME),
    declare("browser.navigate", PKG, "Run a click, fill, scroll and wait script", 4, "", BROWSER_LIB, CHROME),
    declare("browser.click", PKG, "Click one element and report the result", 4, "", BROWSER_LIB, CHROME),
    declare("browser.fill", PKG, "Fill one field", 4, "", BROWSER_LIB, CHROME),
    declare("browser.compare", PKG, "HTTP result versus browser result", 4, "", BROWSER_LIB, CHROME),
    declare("search.web", PKG, "Search through the official Brave or Google API", 4),
    declare(
        "search.duckduckgo",
        PKG,
        "DuckDuckGo search",
        4,
        "DuckDuckGo has no official search API; its result pages are not scraped.",
    ),
)
