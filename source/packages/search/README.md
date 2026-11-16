# mzizi-search

Web search through official provider APIs only (Brave Search API, Google Programmable Search); consumer result pages are never scraped. The package exposes one orchestrator, `SearchOrchestrator`, that takes typed settings and an injected `httpx.Client`, returns normalised, de-duplicated `SearchResult`s and never reads the environment or knows a database exists. The engine builds the settings from its environment and persists what it returns.

This is the pilot of the restructure in `.docs/design/architecture/ENGINE_RUNTIME_AND_PACKAGES.md`. Layout:

- `orchestrator/` the single public class and its settings.
- `shared/` contracts, errors and the provider port used by more than one feature.
- `features/brave/`, `features/google/` one provider each: `settings.py`, `protocol.py` (the API's own URL and paging limits, true of that API), `parse.py` (the only place provider JSON is read) and `provider.py`.
- `features/collect/` paging, normalising and de-duplicating across pages for any provider.

A new provider is a new folder under `features/`; nothing else in the package grows. Tests use `httpx.MockTransport`: no credentials, no network. Run: `uv run pytest source/packages/search`.
