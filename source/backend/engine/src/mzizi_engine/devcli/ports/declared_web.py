"""Ports for web access, browsers, downloads and search."""

from __future__ import annotations

from mzizi_engine.devcli.ports.models import Port, declare

PKG = "mzizi-engine"

WEB: tuple[Port, ...] = (
    declare("fetch.url", "mzizi-fetch", "One identified, policy-checked request", 3),
    declare("fetch.robots", "mzizi-fetch", "The recorded robots.txt decision for a URL", 3),
    declare("web.links", PKG, "Every link, image, media and embed URL on a page, classified", 3),
    declare("scraping.challenge", "mzizi-scraping", "Detect an access challenge, CAPTCHA or block notice", 3),
    declare("scraping.markdown", "mzizi-extraction", "A page to Markdown without header, footer and navigation", 3),
    declare("scraping.crawl", PKG, "Bounded, resumable site crawl with separate inventories", 3),
    declare("web.export", PKG, "Re-export a crawl's inventories as CSV, JSON or JSON Lines", 3),
    declare("web.profile", PKG, "Profile a crawled site: sections, templates, navigation", 3),
    declare("web.family", PKG, "Compare two crawled sites for a shared template", 3),
    declare("web.draft", PKG, "Draft a site structure bundle from a crawl", 3),
    declare("web.survey", PKG, "Crawl, profile and draft a bundle in one run", 3),
    declare("web.rank", PKG, "Rank downloaded files against Mzizi targets from manifest rules", 3),
    declare("download.enqueue", PKG, "Queue a crawl's files, images and media for download", 4),
    declare("download.run", PKG, "Download queued items and track each in MongoDB", 4),
    declare("download.queue", PKG, "Counts of queued, running, done and failed downloads", 4),
    declare("site.watch", PKG, "Crawl a site by URL; keep hashed, versioned pages and report changes", 3),
    declare("web.diff", PKG, "Compare two crawls: pages added, removed and changed", 3),
    declare("web.download", "mzizi-fetch", "Safe, resumable, throttled downloads into quarantine", 4),
    declare("web.downloads", PKG, "Progress and results of downloads", 4),
    declare("browser.open", PKG, "Open a URL in a real browser", 4),
    declare("browser.snapshot", PKG, "Rendered HTML and a screenshot", 4),
    declare("browser.navigate", PKG, "Run a click, fill, scroll and wait script", 4),
    declare("browser.click", PKG, "Click one element and report the result", 4),
    declare("browser.fill", PKG, "Fill one field", 4),
    declare("browser.start", PKG, "Open the one shared dev browser window", 4),
    declare("browser.stop", PKG, "Close the shared dev browser", 4),
    declare("browser.compare", PKG, "HTTP result versus browser result", 4),
    declare("scraping.url", PKG, "Extract fields from a source page with a site module", 3),
    declare("search.web", PKG, "Search through the official Brave or Google API", 4),
    declare(
        "search.duckduckgo",
        PKG,
        "DuckDuckGo search",
        4,
        "DuckDuckGo has no official search API; its result pages are not scraped.",
    ),
)
