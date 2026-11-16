# mzizi-browser

Browser automation behind `BrowserOrchestrator`. A session is opened through an adapter registry (Playwright by default, Patchright as an alternative); the package also holds tab and popup handling, bounded same-document navigation (`shared/traversal`), a media inventory, access-challenge detection and scripted actions. Layout: `shared/` (models, the adapter port, challenge, media, traversal), `features/session` (the Playwright session, scripts, tabs, the shared window) and `features/actions`. Real-browser tests need Chrome and Playwright and skip otherwise (install them with the `browser` extra).

Pagination detection (`shared/pagination`) lives here so the browser never depends on the crawler; the crawler imports it.
