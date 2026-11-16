---
{id: TSK-0C7E435CA201,name: "Design the sources schemas: header, website, API, module and extraction",type: task,status: planned,priority: medium,created_at: 2026-11-16T13:05:53.958Z,updated_at: 2026-11-16T13:49:38.555Z,order: 4096,depends_on: [TSK-6033104AA031]}
---

# Design the sources schemas: header, website, API, module and extraction

## Goal

Design the `sources` schemas: one shared header for any source, plus website, API, module and extraction schemas, and the matching `seed/sources/<scope>/<institution>/<source>/` layout.

## Context

Today an API is only a site manifest with `fetch: { mode: api }`, and there are 8 site manifests, 9 modules and one ranking file. `sections.yml` and `tags.yml` have schemas but no files. The database already models the idea: `source.sources` is the parent of `source.websites` and `source.apis`. The workers task is blocked because `authority_ref` has nothing to resolve to. The API schema must describe only what `mzizi-fetch` can do today (request method, path, parameters, one pagination style), and secrets are referenced by binding name only. This task belongs to the schema and manifest redesign group. The owner approved the sources layout on 16 November 2026: schemas live under `source/schema/` in `database/`, `seed/`, `sources/`, `mapping/`, `vocabulary/`, `engine/` and `extraction/`, and seed inputs live under `seed/` in `data/`, `sources/`, `mappings/`, `vocabularies/` and `_fixtures/`. No version appears in any folder or file name (`.docs/rules/versioning.md`). Nothing is built until the owner approves this task's design in a task comment. Related material: `.docs/design/acquisition/SITE_STRUCTURE_SPEC.md`, `source/schema/README.md`, `seed/README.md` and `AGENTS.md`.

## Acceptance checklist

Work on a Build item starts only after the Approval item is ticked.

- [ ] Design: Write the shared source header: code, kind (website or api), publisher, authority assessment, scope, rate, robots, identity, retries, limits, purposes and licence.
- [ ] Design: Write the website fields and the API fields (base URL, credential binding name, endpoints, parameters, pagination), after checking the fetch package for what is implemented.
- [ ] Design: Decide whether ranking folds into the manifest and where sections and tags go.
- [ ] Design: Define the `uses` block for linking to mappings, vocabularies and extraction expectations by code.
- [ ] Design: Define how `authority_ref` resolves to a source code and what the worker does when it does not.
- [ ] Approval: The owner has approved the design in a task comment, and the comment is quoted under Notes.
- [ ] Build, only after approval: Add the sources schemas and migrate the two real Kenya sites and the geoboundaries source, one at a time.
- [ ] Build, only after approval: Reject any literal secret in an API manifest, by rule.
- [ ] Build, only after approval: Add the authority resolver as a typed port and reject unresolved references before any fetch.
- [ ] Build, only after approval: `task validate` and the relevant checks pass, and every README and design link that mentions the changed files is updated.

## Notes

Record findings, rejected options and the approval here.
## Progress

Built 16 November 2026 in `source/schema/sources/`: `source.schema.json` (entry, header, `uses`, policy), `website.schema.json` (modules, family `extends`, `rank` folded in), `api.schema.json` (GET only, `https` base URL, credential named by `auth.binding`, static non-secret headers, endpoints, the crawler's pagination styles), `module.schema.json` (`mapping`, `discover.endpoint`) and `common.schema.json`. Sections and tags schemas are not carried over. The crawler still reads `site/v1/` until its validator moves.
