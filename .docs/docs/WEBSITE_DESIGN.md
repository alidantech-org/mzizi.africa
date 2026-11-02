---
{id: DOC-WEBSITE-DESIGN,name: WEBSITE_DESIGN,type: documentation,tags: [website,source,filesystem,data-engine]}
---

# Website design

Mzizi needs to know the sites that publish public information: who runs them, which domains they have had, how to read them, and how that understanding changed. This design adds a `website` schema, stores each site's structure as versioned files in the `filesystem`, and lets `source` link every capture to the site and structure version that produced it. It replaces the DevAuto dependency assumed in the earlier research note: Mzizi defines its own machine-readable structure format (see `SITE_STRUCTURE_SPEC.md`).

## Principles

1. **A site is not its domain.** A site has a stable id of its own. It can have many domains, domains change over time, and the same domain can move between sites. Domains are dated attributes, never identifiers.
2. **A site is not a publisher.** Institutions (`source.publishers`) and sites relate many-to-many with a role and a validity period; one portal can serve many agencies and one agency can run several sites.
3. **Structure is evidence-grade data.** A structure version is an immutable set of files; a change is a new version. Previous versions stay readable and reproducible.
4. **Structures are produced by agents in batches.** Humans rarely write them. Every version records the agent, model and inputs that produced it, in the same method terms as `source.methods`. Agents may publish a version without human approval because a structure only describes how to read a site; it never becomes canonical data. Data extracted with it still goes through candidates, validation and review.
5. **The engine runs structures deterministically, with no model in the loop.** An LLM may author or repair a structure; running one is plain code.
6. **Files are files.** Structure bytes live in `filesystem` (folders, files, versions, objects), never in database columns. The `website` schema holds metadata and the pointer to the bundle.

## Schema `website`

```text
sites             the known site: code, name, kind (portal, publication, api, dataset catalogue, archive),
                  jurisdiction (soft id), status (discovered, profiled, active, degraded, paused, retired), first/last seen
domains           hostname, site (FK), role (primary, alias, redirect, legacy, mirror), valid_from/valid_to with precision,
                  scheme, observed_at; unique on (site, hostname, valid_from); NOT unique on hostname alone
site_publishers   site (FK), publisher (soft id into source), role (owner, operator, hosted), valid time
structures        one logical structure per site and purpose (default `main`); current_version (FK), status
structure_versions
                  structure (FK), number, status (draft, validated, active, superseded, rejected), bundle folder (soft id into filesystem),
                  manifest_hash (sha256 of the canonical manifest), schema_version (e.g. mzizi.site/v1), method (soft id into source.methods),
                  created_by (account or agent), validation_report (JSON), notes_summary, supersedes (FK), created_at
structure_files   version (FK), path inside the bundle, role (manifest, module, mapping, notes, example), file_version (soft id into filesystem)
checks            site (FK), structure_version (FK), kind (reachability, fit, drift), outcome, detail (JSON), checked_at; append-only
```

Foreign keys exist only inside `website`. `site_publishers.publisher_id`, `structure_versions.folder_id`, `structure_files.file_version_id` and `structure_versions.method_id` are plain ids checked by the integrity jobs, as everywhere else (`DATABASE_DESIGN.md`).

`structure_versions.status` is the structure's own lifecycle (agent authored, machine validated, active). It is not a data verification state and does not use `source.verifications`.

## Links from `source`

`source.captures` gains three soft columns: `site_id`, `domain_id` (the host actually used) and `structure_version_id` (the structure that drove discovery or extraction, null for manual downloads). `source.documents` gains `site_id` (nullable). The linkage lets a researcher trace any record to its document, capture, site, domain and the exact structure version, and lets the engine find every capture made with a structure that is later found wrong.

## Storage in `filesystem`

Each structure version is a folder: `/website-structures/<site code>/<version number>/` containing the bundle files from `SITE_STRUCTURE_SPEC.md`. Each file is a `filesystem.files` row with a version and a deduplicated object. Because objects are content-addressed, an unchanged module across versions is stored once. `structure_files` lists the files of the version with their roles. `attachments` may also link the bundle folder's manifest to the site (`website.sites`) for the dashboard.

## How the engine uses it

1. Load the active version of a site's structure (by site code) through the database package's read interface or the API.
2. Resolve the base URL from the site's currently valid `primary` domain; try aliases when it fails and record a `checks` row.
3. Execute the structure's discovery and extraction modules deterministically; write captures with `site_id`, `domain_id` and `structure_version_id`.
4. Apply the structure's mappings to produce candidate records with tags attached to lineage.
5. On a mismatch (expected collection missing, field empty, schema drift), write a `checks` row of kind `drift`, set the site `degraded` and stop affected jobs; it does not guess.

## API and generation

The `website` schema is authored as Dryv contracts like every other schema (`sites`, `domains`, `structures`, `structure-versions`, read endpoints; writes only through the engine and the agent-facing batch endpoint). The generated entities and API follow the existing process; the database package owns migrations. The API serves public site metadata and structure files for sites marked public.

## Agent batches

Agents create a version through the data engine, not by writing files directly: submit a bundle, receive a validation report, and the version becomes `validated` (passes the format schema and a dry-run against saved fixtures) or `rejected` with reasons. A batch is an agent run recorded as a method plus a list of produced versions. There is no human approval gate; a failing live check demotes a version automatically.

## Open points

- Name and shape of the agent-facing batch endpoint (engine CLI first).
- Whether `checks` should be partitioned monthly like events; decide when volume is known.
- Treatment of sites that require a browser: the structure marks `fetch.mode: browser`, and the engine decides whether to support it; no stealth or anti-bot evasion is supported.
