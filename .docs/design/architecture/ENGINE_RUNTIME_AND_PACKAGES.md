---
id: DOC-ENGINE-RUNTIME-AND-PACKAGES-20261116
name: ENGINE_RUNTIME_AND_PACKAGES
type: documentation
tags: [engine, runtime, packages, features, dryv, proposal]
---

# Engine runtime and feature packages

**Status: proposal, 16 November 2026.** Nothing here is implemented unless stated. Decision record: [DEC-ENGINE-RUNTIME-AND-PACKAGES-20261116](../../decisions/DEC-ENGINE-RUNTIME-AND-PACKAGES-20261116.md). Work is tracked in the task group "Engine restructure into runtime and feature packages". This guide replaces the "engine does all I/O" parts of [ENGINE_JOB_MODEL](ENGINE_JOB_MODEL.md); read that guide for the staging store and job vocabulary, which still stand.

## Why

`source/backend/engine/src/mzizi_engine` holds about 21,800 lines of capability code: browser automation, crawling, search, site watching, policy, filesystem logic, the developer CLI and developer services. It is larger than every package combined. Handlers contain use cases, raw SQL bypasses Dryv, and no single object assembles the system. Capabilities were written in the engine because it was the nearest place to put them. This guide fixes where code belongs so the engine can be improved without each improvement landing in the wrong place.

## Principles

1. **The engine does two things only:** it assembles and runs capabilities through one runtime class, and it reads and writes the databases through Dryv-generated code.
2. **Capabilities live in packages.** Each package exposes one orchestrator class with typed inputs and outputs. Everything a package can do is reachable through that class.
3. **Packages never know a database exists.** They may own network and browser adapters, behind ports, because crawling and browsing are their job. They never import the engine, a database driver or a Dryv-generated repository.
4. **Front doors call the runtime.** The CLI, the HTTP API and any later agent call `EngineRuntime` methods. None reaches into a package or the database directly. The CLI is a package, not an engine concern.
5. **Every contract is named and typed.** [typed-code.md](../../rules/typed-code.md) applies in full: no free `dict` or `Any` past a parser, no hard-coded source knowledge, regular expressions only through the pattern-matching package, absolute imports, and files within the size limit.

## The runtime class

`EngineRuntime` is the only engine class that matters. It is a composition root: the one place where the system is assembled.

- **Assembly.** Its constructor takes a typed `RuntimeConfig`, builds one orchestrator per package, and injects each package's configuration and ports. No other engine module constructs a capability.
- **Capabilities as members.** Each is exposed as a typed attribute or method group, for example `runtime.browser`, `runtime.crawl`, `runtime.search`, `runtime.watch`, `runtime.filesystem` and `runtime.policy`.
- **Configuration that can change.** Configuration is an immutable snapshot with a generation number. `reconfigure(capability, config)` swaps the snapshot. A running job keeps the snapshot it started with unless its package takes a config-provider port that it re-reads between steps.
- **Execution plan.** For each capability the runtime declares whether it is exposed to front doors or internal, a concurrency ceiling, a queue, a timeout and a cancellation token. Capabilities that are safe in parallel run on workers; ones that are not, such as a single shared browser profile, are serialised. Packages stay unaware of scheduling.
- **Lifecycle.** `start`, `stop`, `health` and `drain` live in the runtime.

## Persistence

The engine persists through Dryv-generated repositories only: PostgreSQL for verified data and MongoDB for staging, as in [DEC-SINGLE-POSTGRES-MONGO-STAGING-20261115](../../decisions/DEC-SINGLE-POSTGRES-MONGO-STAGING-20261115.md). Tables that are still hand-written SQL move into Dryv and are regenerated. The engine's hand-written persistence code is limited to **binding modules**: each implements one package's ports using the generated repositories and maps package contracts to generated ones. A binding module holds no business logic. Transactions are scoped by a unit of work that the runtime opens.

A package picks one of three methods per operation:

| Method | Use it for | How it works |
|---|---|---|
| Return a typed result | Short, bounded work: parsing, extraction, a policy decision | The package returns a frozen contract and the runtime persists it in one transaction. |
| Emit to a sink port | Long or streaming work: crawls, site watching | The package takes a typed `Sink` protocol and emits records in batches. The runtime implements it with the generated repository and applies backpressure. |
| Checkpoint and resume | Anything restartable | The package accepts and emits a typed `ResumeState`. The runtime stores it, so a crash resumes mid-run. |

Raw bytes and metadata rows stay consistent through a transactional outbox: the row is written as pending, the bytes are stored through the object-store port, then the row is confirmed. This keeps filesystem metadata and object bytes separately owned.

## Package shape

Every feature package has the same shape. The root holds only `__init__.py`, `py.typed` and three folders, so a new capability never enlarges the root.

```text
mzizi_<pkg>/
  orchestrator/          the single public class; imports features only
  shared/                contracts, ports or helpers used by two or more features
  features/
    <capability>/        one self-contained folder per capability
      contracts/         config, requests, results, events, records
      ports/             protocols the engine or the package's own adapters implement
      parse/ encode/     the only untyped-data boundary for this feature
      <logic files>      small, one responsibility each
```

A feature never imports a sibling feature. Anything two features need moves to `shared/`. The orchestrator is a thin facade that composes features and holds no logic of its own.

## Dependency direction

Dependencies point one way and are enforced by an import-boundary check:

```text
pattern matching, shared contracts
  -> fetch, browser, scraping, extraction, filesystem, policy
    -> crawl, watch, search
      -> cli
        -> mzizi_engine (runtime and binding modules)
```

Nothing imports `mzizi_engine` except the entry points that start it. A package depends on another only through that package's public contracts and orchestrator.

## Where current code goes

| Today in the engine | Target |
|---|---|
| `web/browser/*` | `browser` package, with Playwright as one adapter behind a browser-adapter port |
| `web/crawl/*`, `web/hunt.py`, `web/pipeline.py`, `web/export.py` | `crawl` package composing `browser` and `fetch` through ports |
| `web/handlers/site.py`, site storage in `sitestore.py` | `watch` package: hashing, versioning and change reporting |
| `web/search/*` | `search` package with providers behind a protocol |
| `policy/*` | `policy` package with rules loaded from manifests |
| `filesystem/*` | `filesystem` package for logic; persistence moves to Dryv-generated repositories behind a port |
| `devcli/*`, `devservices/*` | `cli` and developer-services packages calling the runtime |
| `executor.py`, `capabilities.py`, `app.py`, `config.py`, `layout.py`, `activity.py` | folded into the runtime or replaced by it |
| `auth.py` | undecided: see open questions |
| `api/` generated routes | stay generated; each handler is one call into the runtime |

The full module-by-module inventory is a separate task.

## Migration rules

- One capability per task, one commit per task. A move changes no behavior; tests pass before and after and move with the code.
- A module does not move until it passes mypy strict, has no free `Any` or `dict`, has no hard-coded source knowledge and uses regular expressions only through the pattern-matching package. The move is also the cleanup.
- Documentation and links change in the same task as the code.

## Open questions

1. **HTTP transport.** The default is to keep only the Dryv-generated routes in the engine, each calling the runtime. A separate transport package is the alternative.
2. **Authentication and authorisation.** It could be a package with Dryv tables or part of the runtime.
3. **Crawl and browser.** They are separate packages by default so the browser stays reusable; this can be revisited.
4. **Placement of text helpers** such as `markdown_repair` (`scraping` or `extraction`).
