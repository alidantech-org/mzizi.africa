---
id: DOC-3D7A1F5E2B01
name: Mzizi engine developer CLI and capability proving plan
type: documentation
tags: [engine, cli, testing, scraping, extraction, plan]
extra: {status: planning_only, implementation_approved: false, task_creation: user_directed_only}
---

# Mzizi engine — developer CLI and capability proving

**PLANNING ONLY.** This folder proposes how to exercise every Python package capability through the engine with real PDFs, real URLs and a real browser, before the engine-to-database path is finished. Nothing here is implemented or approved. Tasks are created one at a time on the user's direction.

## The question and the short answer

The user asked: can the engine CLI run `extraction`, `scraping`, `manifest` and `fetch` on a local PDF or a live website so that we *see* the work happen, with fixtures and outputs in a git-ignored local folder, and later with MongoDB and a vector database?

**Yes, and most of the plumbing exists.** The engine already registers named capabilities (`extraction.pdf|geojson|csv|json`, `scraping.links`, `manifest.check_seeds`, `manifest.validate_structure`, `source.gate`, `filesystem.sync`, `process.info`) in `source/backend/engine/src/mzizi_engine/capabilities.py`, each taking a JSON-able dict. The path input is already confined to `ENGINE_INPUT_ROOT`. What is missing is a *human-facing* CLI over those handlers, a dev workspace for inputs/outputs, handlers for the parts of the packages that are not yet capabilities (selector/field extraction, polite fetch, robots, rate limits), a browser adapter and the dev-only service adapters.

## How the pieces are tested — three layers

| Layer | Purpose | Where | Runs |
|---|---|---|---|
| Unit tests | Prove a pure function on in-memory bytes/strings. No network, no files outside `tmp_path`. Already exist per package (`source/packages/*/tests`). | `uv run pytest source/packages/<pkg>` | Every change, CI |
| Capability tests | Prove the engine handler wraps the package correctly (payload in, typed result out). Exist for the API; extend per new capability. | `source/backend/engine/tests` | Every change |
| **Live proving (new)** | A person runs a named command on a real artifact and *watches* the result: text from a PDF, links from a site, a browser opening. Outputs persist for inspection. | `mzizi …` CLI + `.local/dev/` | On demand, by hand |

Live proving is not a test suite and never gates CI. When a live run finds a bug, the fixture that reproduces it is reduced to a small file and promoted into a unit test; that loop is the main value of this plan.

## Design rules

1. **One implementation.** CLI commands call the same capability handlers the HTTP API calls. No logic lives in the CLI beyond argument parsing, rendering and writing the run folder.
2. **Packages stay pure.** Packages never see Mongo, vectors, the browser session store or the run folder. The engine owns I/O (`ENGINE_JOB_MODEL`, AGENTS.md).
3. **Dev results are not evidence.** Everything a dev command produces is labelled `dev-run`, written only under `.local/dev/outputs/`, and never registered in the filesystem registry or database unless a command explicitly says so. The collection gate (`source.gate`) still applies to live URLs; technical ability to fetch never implies authority (source-redesign principle 10).
4. **No source knowledge in code.** Per-site selectors, URLs and policies come from manifests/fixtures supplied at run time (`.docs/rules/typed-code.md`).
5. **Typed contracts.** Every command's input and output is a frozen pydantic model, not a free `dict`.

## Documents

| Document | Contents |
|---|---|
| [01 — CLI command reference](01-cli-command-reference.md) | `mzizi` command groups, flags, examples and expected output per command |
| [02 — Capabilities and package mapping](02-capabilities-and-package-mapping.md) | Package-by-package: what exists, which capability exposes it, gaps to fill |
| [03 — Local dev workspace](03-local-dev-workspace.md) | `.local/dev/` layout, run folders, fixtures, manifests, safety |
| [04 — Scraping, browser and site manifests](04-scraping-browser-and-site-manifests.md) | Step-by-step scraping proof ladder, real-browser mode, YAML structures |
| [05 — MongoDB and vector database](05-mongodb-and-vector-dev-services.md) | Dev-only services, docker setup, commands and what each proves |
| [06 — Phased delivery](06-phased-delivery.md) | Order of work, task candidates, acceptance, risks, open decisions |

## Related

[Source redesign](../source-redesign/README.md) (esp. [07 storage and vector options](../source-redesign/07-storage-and-vector-options.md), [10 build vs reuse](../source-redesign/10-prior-art-and-build-vs-reuse.md), [11 tool integration](../source-redesign/11-tool-integration-and-contracts.md)); [packages map](../../../source/packages/README.md); [engine README](../../../source/backend/engine/README.md).
