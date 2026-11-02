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
                  jurisdiction (soft id), status (expected, discovered, profiled, active, degraded, paused, rejected, retired), first/last seen
domains           hostname, site (FK), role (primary, alias, redirect, legacy, mirror), valid_from/valid_to with precision,
                  scheme, observed_at; unique on (site, hostname, valid_from); NOT unique on hostname alone
site_publishers   site (FK), publisher (soft id into source), role (owner, operator, hosted), valid time
structures        one logical structure per owner and purpose (default `main`); owner_kind (site, family), owner_id; current_version (FK), status
structure_versions
                  structure (FK), number, status (draft, validated, active, superseded, rejected), bundle folder (soft id into filesystem),
                  manifest_hash (sha256 of the canonical manifest), schema_version (e.g. mzizi.site/v1), method (soft id into source.methods),
                  created_by (account or agent), validation_report (JSON), notes_summary, supersedes (FK), created_at
structure_files   version (FK), path inside the bundle, role (manifest, module, mapping, notes, example), file_version (soft id into filesystem)
checks            site (FK), structure_version (FK), kind (reachability, fit, drift), outcome, detail (JSON), checked_at; append-only
```

Foreign keys exist only inside `website`. `site_publishers.publisher_id`, `structure_versions.folder_id`, `structure_files.file_version_id` and `structure_versions.method_id` are plain ids checked by the integrity jobs, as everywhere else (`DATABASE_DESIGN.md`).

`structure_versions.status` is the structure's own lifecycle (agent authored, machine validated, active). It is not a data verification state and does not use `source.verifications`.

## Families, domain patterns and similarity

Governments publish sites in families: `{county}.go.ke` for county governments, `{county}assembly.go.ke` for county assemblies, `{constituency}.ngcdf.go.ke` for constituency funds, `{ministry}.go.ke` for ministries. Nobody should register 47 county sites by hand, and a fix to how county sites list tenders should not be made 47 times. Independent bodies such as the electoral commission or the statistics bureau are not hierarchical members of any such family, yet they share traits (a downloads section, PDF publications). The model captures all of this.

```text
site_families     code, name, kind (geographic_unit, institution_type, independent_body, platform, purpose), description,
                  subject_kind (what members are about: e.g. county, constituency, ministry), jurisdiction (soft id), status
domain_patterns   family (FK), template (`{county}.go.ke`), variables (JSON: slot -> subject source and slug rule),
                  scheme, expected domain role, status, notes
site_members      site (FK), family (FK), role (member, template_source), basis (pattern, agent, fingerprint), score (0 to 1),
                  method (soft id), valid time
site_subjects     site (FK), target_kind (`geography.units`, `governance.institutions`, `organization.entities`,
                  `reference.classifications` for the kind of material), target_id (soft), relation (serves, operated_by, about, publishes), valid time
traits            owner_kind (site, family), owner_id, tag (`platform:wordpress`, `section:downloads`, `purpose:data-portal`),
                  method (soft id), score (0 to 1), observed_at
relations         from_kind/from_id and to_kind/to_id (site or family), relation (similar_to, derived_from, shares_platform, shares_module),
                  score, basis (agent, fingerprint), evidence (JSON)
fingerprints      site (FK), kind (markup, navigation, assets, document_types), digest and feature vector (JSON), computed_at, check (FK)
```

- **Expected sites.** A pattern plus a subject set creates sites in status `expected`. For `{county}.go.ke` the subjects are the units of the county level from `geography.units`; each gets a candidate hostname built with the slug rule (lowercase, strip words such as county, join) and a `site_subjects` row. A rate-limited probe records a `checks` row of kind `reachability`: reachable hostnames promote the site to `discovered`, failures become `rejected` or get a slug override (an alias on the subject) and a retry. Probing obeys each family's politeness policy and never loops over hosts faster than the policy allows.
- **Patterns are data, not identity.** A pattern yields candidate domains; the resulting `domains` rows are dated attributes of a site. If a county moves to a new domain, the site keeps its id, gets a second domain and a legacy role on the old one.
- **Subjects tie sites into the system.** A county site links to its `geography.units` row (and through it the governance institutions of that unit), an assembly site to the assembly institution, IEBC and KNBS to their `organization.entities` or institution records, and a tenders portal to the document kind it publishes. Reading a county page of the product can list its official sites; reviewing a governance institution can show where it publishes.
- **Traits are tags.** Agents assign namespaced traits (platform, section, purpose, document types) with confidence. Traits attach to families as well as sites, so a family states the traits all members are expected to share, and a member that lacks one is flagged.
- **Fingerprints.** The engine computes fingerprints (markup skeleton, navigation labels and paths, asset hosts, document type mix) from fetched pages. Similarity between fingerprints suggests membership of an existing family or a `similar_to` relation, written with `basis: fingerprint` and a score. Suggestions are data, not decisions: they never rewrite a structure.
- **Cross-family DNA.** `relations` of kind `shares_module` link families that reuse a module, for example a generic "downloads section" module used by both the electoral commission and the statistics bureau although their sites are otherwise unrelated.

### Structure inheritance

A family owns a base bundle. A site's bundle may `extends` its family's active version and store only an overlay (see `SITE_STRUCTURE_SPEC.md`). The engine resolves the effective structure at load time: the family version, then the site overlay, and records both version ids on captures. Repairing a family module fixes every member, and a member that needs a difference overrides only that module. If a probe shows a member diverges too far, the overlay grows or the member is moved to another family.

## Legal and source approval gate

`LEGALITY_SAFETY_AND_COMPLIANCE.md` is binding on this design. Two consequences shape the model:

1. **A structure is a technical recipe, not a licence.** Publishing a validated structure never starts collection. Technical validation (schema, static checks, dry run) and legal/source approval are independent gates, and the engine runs a structure only when both pass.
2. **Legal status is its own record.** Each site has an append-only history of legal/source assessments:

```text
assessments       site (FK), jurisdiction (soft id), status (not_reviewed, in_review, approved, approved_with_conditions,
                  restricted, rejected, expired), source_type (api, open_data_portal, official_website, document_repository, third_party),
                  access_basis (open_endpoint, published_terms, open_licence, written_permission, ati_response, other),
                  access_conditions, licence_name/url/version, rights_holder (unknown stays explicit),
                  personal_data_categories (JSON, including none_known), processing_purpose, lawful_basis,
                  approved_scope (JSON: paths, fetch modes, frequency, publication scope), conditions, rationale,
                  evidence (JSON refs to saved terms, permissions, advice), reviewed_by (soft account id), reviewed_at, review_due_at,
                  is_current, supersedes (FK)
```

`source.captures` gains a soft `assessment_id`, so a later review can tell which approval governed a collection. Gate semantics follow section 9.3 of the compliance document: `not_reviewed` and `in_review` allow only bounded discovery and assessment (including the reachability probes of expected sites), `approved` and `approved_with_conditions` allow collection within the approved scope and conditions (fail closed if a condition cannot be enforced), and `restricted`, `rejected` and `expired` stop collection. A site is `degraded` for technical drift and `restricted` for legal drift; neither is inferred from the other. Agents may propose an assessment draft (identity, terms found, licence, personal-data signals) but cannot approve one; `reviewed_by` is a named human account.

The engine also keeps jurisdiction dossiers (`website.dossiers`: regulator, legislation repository, applicable laws, treaty status, reviewer and date, launch stage research, pilot, production or paused) so no country moves from research to production collection because its structures exist. Dossiers live in the `website` schema beside assessments because the collection gate evaluates both together; they refer to the jurisdiction by plain id.

### The gate

`engine/database/src/gate.ts` is the single decision point: `checkCollection(db, request)` loads the site's current assessment and its jurisdiction's dossier and returns allowed or denied with reasons and the most conservative limits. It fails closed. Collection (`collect`) needs a status of `approved` or `approved_with_conditions`, a named human reviewer and review date, a review date that has not passed, a jurisdiction whose dossier is at `pilot` or `production`, a lawful basis when personal data is expected, a request inside the approved scope (host, scheme, allowed and denied paths, fetch mode, rate, purposes), and only conditions the engine can enforce (maximum rate, no publication, excluded paths, attribution required; anything else denies). Bounded assessment contact (`assess`: GET or HEAD at a low rate) is allowed under `not_reviewed`, `in_review`, `approved` and `expired`, and refused under `restricted` and `rejected`. Public API endpoints for assessments and dossiers do not exist: rationale and evidence are internal, and a later task can expose a sanitised summary (status, licence name, attribution) per site.

On a credible restriction, complaint, unexpected sensitive data or expiry, the engine pauses scheduled jobs for the site, quarantines affected candidates (`quarantined` in `staging.candidates`) and raises a review item.

## Links from `source`

`source.captures` gains four soft columns: `site_id`, `domain_id` (the host actually used), `structure_version_id` (the site overlay or standalone structure that drove discovery or extraction, null for manual downloads) and `family_version_id` (the inherited base, null when none). `source.documents` gains `site_id` (nullable). The linkage lets a researcher trace any record to its document, capture, site, domain and the exact structure version, and lets the engine find every capture made with a structure that is later found wrong.

## Storage in `filesystem`

Each structure version is a folder: `/website-structures/<site code>/<version number>/` containing the bundle files from `SITE_STRUCTURE_SPEC.md`. Each file is a `filesystem.files` row with a version and a deduplicated object. Because objects are content-addressed, an unchanged module across versions is stored once. `structure_files` lists the files of the version with their roles. `attachments` may also link the bundle folder's manifest to the site (`website.sites`) for the dashboard.

## How the engine uses it

1. Load the active version of a site's structure (by site code) through the database package's read interface or the API.
2. Resolve the effective structure (family base plus site overlay) and the base URL from the site's currently valid `primary` domain; try aliases when it fails and record a `checks` row.
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
