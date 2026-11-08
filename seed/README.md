# Mzizi seed registry

`seed/` is the single repository home for all manually or AI-prepared bootstrap/seed inputs: auth role and permission definitions, global file types, jurisdiction lists, fixed folder definitions, folder patterns, site-structure YAML/JSON, mappings and seed-specific source-code artifacts. This user-directed convention was established on 8 November 2026. Runtime loaders, reusable validation, generation and S3 client code stay under `source/`; Dryv schema contracts stay under `dryv/`. Data payloads must not be hidden in loader code or copied into per-service fixture directories.

On 8 November 2026 the scattered system seeds were relocated here (task `TSK-0F4398B91D38`): the auth baseline, reference vocabularies, Kenyan catalogues and registries, policy, patterns, import mappings and site-structure bundles. `manifest.yaml` is a functional manifest of those inputs and `manifest.lock.json` is its generated lock. Nothing has been uploaded to S3: the lock records mappings and says `not_uploaded`. The disabled illustrative example moved to `examples/manifest.example.json`. The relocation inventory, duplicate decisions and non-adopted items are in `.docs/docs/SEED_RELOCATION_INVENTORY.md`.

## Entry points

Run from the repository root after `uv sync --all-packages` (see `source/packages/README.md`):

```bash
uv run mzizi-manifest check      # validate folder metadata, manifest, dependencies, consumers and the lock (no writes)
uv run mzizi-manifest lock       # regenerate manifest.lock.json after changing a seed file or the manifest
uv run mzizi-manifest report     # effective metadata per artifact
uv run mzizi-db init             # create/update mzizi_new and apply seed/global/auth (idempotent, additive)
uv run mzizi-db bootstrap-admin  # first administrator; identity from the AUTH_BOOTSTRAP_* variables named in global/auth/bootstrap.yaml
uv run mzizi-filesystem sync     # preview of the seed registration through the filesystem package (see below)
uv run pytest source/packages/manifest source/packages/filesystem source/packages/database   # registry, filesystem and auth checks
```

`scripts/seed_check.py`, `scripts/db.py` and `scripts/filesystem.py` are thin wrappers over the same package APIs; the engine exposes the same operations (`POST /v1/manifests/validate`, `POST /v1/filesystem/sync`).

Code that reads these files stays under `source/`: the manifest/registry code in `source/packages/manifest`, the auth baseline loader in `source/packages/database` (`mzizi_database.loaders.auth`) and publication in `source/packages/filesystem`. The loaders that applied the other seeds to the old Dryv-entity database were archived with the old engines (`.docs/_archives/2026-11-08-rewrite-snapshot`); their manifest entries say `loader_status: archived` and must be reimplemented against the rewrite schema by the owning milestone. Override locations with `MZIZI_SEED_ROOT`, `MZIZI_SCHEMA_ROOT`, `MZIZI_REPO_ROOT`.

## Synchronization into the filesystem registry

`uv run mzizi-filesystem sync --manifest seed/manifest.yaml` previews the registration of every adopted artifact (the default writes nothing); `--apply --actor <account>` creates the logical folders parent-first (one folder per seed directory, carrying its `_folder.yaml` classification), then hashes, deduplicates, uploads and verifies each file, and registers file and version rows with a provenance snapshot (seed flag, artifact role, acquisition class, preparation, scope, review state, the descriptor each field was resolved from, manifest release and checksum, input references, intended access). Seed artifacts are stored as immutable content-addressed objects under `internal/content/sha256/...` even when their rows define public folders; the access of an artifact is the access of its folder, never of the records it generates. Details, outcomes, retention policies and recovery: `.docs/docs/FILESYSTEM_SCHEMA.md`.

`seed/manifests/` holds generic sync manifests (`kind: filesystem-sync`, validated against `source/schema/filesystem/sync-manifest.schema.json`). `manifests/legacy-artifacts.yaml` registers the old `.data` artifacts relocated to the ignored subtree `seed/generated/legacy-artifacts/` (backups, reports, logs, a CA bundle, content-addressed stored objects). They are not seed data: their manifest records what they actually are and gives them non-public access. Credential-bearing files (`.data/dev.env`, `env.local`, `p4-scratch.env`, `real.env`, `dev-auth/`) stay in `.data`, outside any sync; `.data/raw` is excluded and refused by the planner. Inventory: `.docs/docs/DATA_DIR_INVENTORY.md`.

## Folder metadata (`_folder.yaml`)

Origin and access are recorded once per folder, not per file. Keep these dimensions separate:

| Field | Values | Meaning |
|---|---|---|
| `role` | `seed_input`, `pattern_definition`, `site_structure`, `import_mapping`, `policy_definition`, `research_registry`, `generated_output` | What the artifact is for |
| `acquisition_class` | `static_curated`, `pattern_generated`, `externally_collected`, `internally_derived` | How the content came to exist |
| `preparation` | `human_prepared`, `ai_prepared`, `human_and_ai_assisted`, `programmatically_generated`, `unknown` | Who or what prepared the bytes. AI-prepared does not mean verified, generated or publishable |
| `access` | `public`, `internal`, `restricted`, `private` | Intended read access (maps to the S3 prefix of the same name; only `public/` is anonymous) |
| `scope` | `{kind: global}`, `{kind: system}`, `{kind: jurisdiction, code: ke}` | Must match the top-level folder (`global/`, `system/`, `ke/`) |
| `review` | `{status: reviewed or needs_review, note}` | Honest record of what still needs confirmation |
| `authorization` | `{by, date, reference}` | Required in the same descriptor as `access: public` |
| `allow_weaker_children` | boolean | Whether deeper folders may be less restrictive than this one (root: true so that an explicitly authorized public folder is possible) |
| `overrides` | `{file name: {fields, reason}}` | Explicit per-file exceptions in the containing folder, each with a reason; cannot set `public` |

Inheritance, in order: (1) resolve descriptors from the seed root down to the containing folder; (2) for each field the nearest folder that sets it wins; (3) a deeper folder may set a more specific classification; (4) a per-file override applies last and only if listed with a reason; (5) a missing access policy resolves to `internal` and is warned; a missing role, acquisition class, preparation or scope is an error before registration; (6) nothing is inferred from folder names such as `generated` or `public`; (7) a folder cannot be less restrictive than an ancestor unless that ancestor sets `allow_weaker_children`, and `public` always needs its own `authorization`. Prefer a small correctly classified deeper folder over many overrides. `uv run mzizi-manifest check` enforces all of this; the root `_folder.yaml` sets `access: internal`.

## Manifest and lock

`manifest.yaml` is authored: entry `id`, `path` or `glob`, `loader` (allowlisted in `src/seed-manifest.ts`), `target`, `database_target_state`, `key_columns`, `depends_on`, `consumers` (files that must mention the path), `relocated_from` (historical origin path), `notes`, `sync_policy`. `manifest.lock.json` is generated and tracked: per file the SHA-256, size, media type, effective metadata, the descriptor each field was resolved from (`resolved_from`), `relocated_from`, bucket `mzizi` and a mapping `object_key` such as `internal/seeds/global/auth/roles/2026-11-08.1/roles.<sha16>.csv`, and `upload_status: not_uploaded`. A move never rewrites `relocated_from` or checksums retroactively: a new manifest release records the new location and the lock history stays in Git. Generator information is recorded as the tool, never a fabricated model or author.

## Test fixtures (`seed/fixtures/`)

Everything that is only test or sample data lives here, grouped by purpose, so source code stays free of fixtures, samples, example payloads and test data. Fixtures have the role `test_fixture` and a system scope, are classified by `_folder.yaml` like every other folder, but are **not seeds**: they have no manifest entry and are never applied, registered or uploaded. `mzizi-manifest check` fails if a fixture appears in the manifest or lacks effective metadata.

| Folder | Contents | Read by |
|---|---|---|
| `fixtures/neutral-model/` | Country-neutral model rows (Kenya, South Africa, illustrative Kenyan sites) | API and DB engine tests through `readFixture` (`fixturesDir` in `api/src/neutral/fixture-loader.ts`) |
| `fixtures/site-structures/` | Four illustrative site-structure bundles (manifest, modules, mappings, example pages) | Python structure tests (`FIXTURES_ROOT` in `seedroot.py`) |
| `fixtures/extraction/` | Crawl pages, geoBoundaries slices, World Bank responses | Python extractor and importer tests |
| `fixtures/contracts/` | Contract example payloads and the shared gate decision vectors | `source/backend/contracts/validate_examples.py`, Python and Bun gate tests |

Rules: no copy of a fixture may sit beside code; a fixture that is also applied as a real seed belongs in the seed folders with a manifest entry instead. Nothing in `source/` may embed Kenya-, site- or Wikipedia-specific data: such constants live under `seed/system/policy` or `seed/ke/{policy,reference}` and are read through `seedRoot` / `read_seed_json`.

## Ignored and generated inputs

`generated/`, `cache/`, `local/` are ignored by `seed/.gitignore`; none exists yet because nothing is generated. A generated seed output must get a descriptor with `preparation: programmatically_generated`, a manifest entry naming its generator and input entries, and a regeneration command in this README. Only the lock is a generated tracked file here (regenerate with `uv run mzizi-manifest lock`).

## Known limitations

- Preparation is `unknown` for `global/reference`, `system/mappings`, `system/policy`, `ke/reference` and the site bundles because the files do not say who prepared them; each carries `review.status: needs_review`. `uv run mzizi-manifest check` lists the warnings.
- Nothing is uploaded or registered in S3 or PostgreSQL yet: publication is implemented and tested against mocked S3, but the PostgreSQL registry (descriptor inheritance as stored metadata) is the filesystem milestone (task `TSK-3EA8C40B0F60`).
- `ke-iebc-catalogue.json` has no loader; `ke-orpp-catalogue.json` and `ke-priority-publishers-catalogue.json` are read only by tests.
- `global/filesystem/file-types.csv` and `ke/filesystem/folders.csv` do not exist yet. File formats are held by `global/reference/media-formats.json` (the authoritative source chosen over the legacy CSVs); the filesystem and reference tasks derive the CSV contracts and folder patterns.
- Non-auth loaders were archived with the old engines (`loader_status: archived` in the manifest).

## Layout

The paths below that exist today are marked in the Adopted column of the next table; the rest remain the target convention for later tasks.

| Repository path | Purpose |
|---|---|
| `seed/manifest.yaml` | Functional root manifest (authored), with generated `manifest.lock.json`; focused manifests may be added under `seed/manifests/`. |
| `seed/manifests/` | Focused manifests for larger collections, always resolved from the seed root. |
| `seed/global/jurisdictions.csv` | Curated jurisdiction identities; not a country-specific list hidden in application code. |
| `seed/global/filesystem/file-types.csv` | Global physical file-format catalog, unrelated to country scope. |
| `seed/global/filesystem/file-type-extensions.csv` | Extension aliases for file types. |
| `seed/global/auth/` | Baseline roles, recognized permissions and role bundles; no credentials, live user exports or passwords. |
| `seed/system/filesystem/folders.csv` | Fixed system folder definitions. |
| `seed/system/patterns/` | System folder templates, such as a log folder by pipeline/year/month. |
| `seed/ke/filesystem/folders.csv` | Curated Kenyan logical folders, for both public and non-public branches. |
| `seed/ke/patterns/` | Jurisdiction-specific versioned generation rules; Kenya particulars are data. |
| `seed/ke/sites/<site-code>/` | Seeded site structures, mappings, sample input references and manifests. |
| `seed/<jurisdiction-code>/...` | The same understandable organization for other jurisdictions; codes resolve against the jurisdiction registry. |
| `seed/generated/` | Ignored reproducible outputs; a manifest and generator/input versions must make them reproducible. |
| `seed/local/`, `seed/cache/` | Ignored private local input or cached artifacts; never the sole surviving copy of curated data. |

Only real curated inputs create these directories; do not populate empty placeholder taxonomies. Generated paths can mirror the curated structure, e.g. `seed/generated/ke/filesystem/folders.csv`. Small reviewed non-sensitive files and manifests belong in Git; large reproducible outputs do not. Sensitive identities/access tokens must not be committed or published. A manifest records the S3 location of every adopted seed artifact, including ignored inputs, so a checkout can verify/fetch or regenerate it.

## Manifests: file identity, S3 registration and database application

The manifest describes three separate operations: validate a seed artifact; register its immutable bytes in the existing S3/filesystem registry; apply its rows or pattern definitions to their owning schema. Uploading a CSV is not the same as inserting its records, and a target logical folder is not an S3 object key.

Each entry must define: stable entry ID and version; seed-root-relative local path; media type; acquisition class; owning domain/recognized loader and target; natural-key columns or binding; dependency IDs; literal jurisdiction scope or explicit global/system scope; SHA-256 (or approved release-lock mechanism); sensitivity/access prefix; durable bucket/key mapping; and synchronization policy. Pattern entries also name definition versions, validated parameters, output bindings and code/tool dependencies. Secrets are supplied through environment configuration only. Manifest targets and loader names must be allowlisted; never execute arbitrary SQL or source files simply because a manifest requests them.

The disabled `examples/manifest.example.json` is documentation, not an executable seed plan. A real manifest release must validate all paths and dependencies, reject traversal/cycles/missing or conflicting keys, verify checksums and reject unregistered loaders. Follow the filesystem/auth schemas once implemented; candidate target names in planning documents are not live tables.

Every adopted artifact must land in bucket `mzizi`. Prefer immutable versioned/hash-qualified keys such as `internal/seeds/global/filesystem/file-types/<version>/<sha256>.csv`. Curated seed files normally belong under `internal/seeds/` even when they create a public logical folder. Explicitly publish a seed artifact only when its own content is approved for public access. `public/` is the sole anonymous-readable prefix; restricted/private/internal/custom prefixes are private. Git ignore does not grant permission to omit durable storage or reproducibility metadata.

Local S3 endpoint: `http://192.168.100.13:18333`. Production Docker endpoint: `http://object-storage:8333` on `home-services`. Region: `us-east-1`; credentials: existing environment values. Public origin: `https://res.alidantech.org`, e.g. `/mzizi/public/...`. Do not create buckets, credentials, storage services or change home infrastructure. Filestash remains independently managed. Client presigned URLs must use an endpoint reachable by their intended clients; never hand a mobile client an internal Docker hostname.

## CSV contracts to finalize in the schema tasks

| File | Proposed header and behavior |
|---|---|
| Global file types | `code,name,media_type,default_extension,category,description` — PDF, CSV, JPEG, Markdown etc.; unique stable code, no jurisdiction column. MIME identifiers are normalized. |
| Extension aliases | `file_type_code,extension` — FK-resolved stable format code, normalized extensions such as jpg/jpeg; do not assume extension uniquely proves content type. |
| Fixed folders | `code,parent_code,name,access_class,jurisdiction_code,purpose` — stable seed code, optional parent by code, explicit access class; jurisdiction blank only for global/system folders. |
| Pattern definitions | YAML/JSON with stable code/version, scope, parameters, input bindings, output path template, create timing and allowed access class. Definitions become reference-owned patterns, not pre-expanded wildcard folder names. |

Examples of logical folders: public/ke/documents and restricted/ke/research; system internal/logs/<pipeline>/<year>/<month>. `private`, `restricted` and `internal` are distinct organizational classes with explicit application permissions, while all three remain S3-private. Stable folder codes must include enough scope to avoid collisions. The backend generates row IDs and resolves codes to actual FK references; never embed guessed UUIDs. Use UTF-8, header rows and ISO timestamps where appropriate. Reject unknown parent/type/jurisdiction codes and duplicate codes; input order cannot determine correct relationships.

## Dynamic patterns and ordinary folder rows

`logs/*/*` expresses intent, not literal directory names. A rule might use `internal/logs/{pipeline_code}/{year}/{month}` with whitelisted parameters and a pipeline run as trigger. Validate/normalize each segment; reject separators, traversal and unbounded expansion. Store definitions and versions in `reference`; the engine previews and executes them. Create the concrete folder rows only when needed, using stable keys and idempotent constraints. Files link to concrete folders, never unresolved templates. Geography-backed patterns enumerate actual approved units; country-root scope is explicit. Scope changes and pattern updates cannot silently widen access or move/reclassify existing files.

Fixed Kenyan folders can be curated directly in CSV. A general jurisdiction-folder pattern may instead derive them from the jurisdiction list. Choose one authoritative owner per output: duplicate fixed and generated ownership requires an explicit adopt/reconcile decision. A pattern can generate public and private folder branches separately. It must not manufacture real-world people, sites or observed facts.

## Proposed table responsibilities

Exact columns and DDL belong to the filesystem/reference/engine tasks; this convention does not create them.

| Owner / candidate | Minimum relationships and role |
|---|---|
| `filesystem.file_types` | PK id, unique code, format name/media type/default extension/category; physical format, not country or document subject. |
| `filesystem.file_type_extensions` | Composite key type + extension, FK to file type; aliases support jpg/jpeg and shared extensions. |
| `filesystem.folders` | PK id, stable seed code if seeded, parent FK, display name, access class, jurisdiction FK when applicable, purpose; prevent cycles and sibling collisions including roots. Add geography binding when its exact model is agreed. |
| `filesystem.files` | PK id, primary folder FK, stewardship/access references and display name; file_type FK denotes current logical type if revisions are format-stable. |
| `filesystem.versions` | File FK, immutable object FK, revision number and file_type FK for the exact bytes; an authoritative per-version type is necessary if a revision may change format. Current file type can then be derived. |
| `filesystem.objects` | Store FK, immutable bucket/key reference, SHA-256, byte length and detected content type; unique storage address. Dedup respects visibility/security boundaries. |
| `filesystem.stores` | Existing backend identity and environment configuration references, not embedded credentials. One bucket does not require separate public/private store rows. |
| `reference` pattern registry | Pattern identity/version, scope, validated inputs/dependencies, output bindings and optional filesystem-version FK for rule bytes. |
| `engine` seed/run metadata | Manifest release, input hashes, loader version, preview/result/error counts and FK-backed output lineage where required; reuse the agreed engine model rather than create an independent seed platform. |

Model seeds as versioned input artifacts, registered through existing files/versions; avoid an automatic new seed schema or parallel file registry. Dataset/source/evidence relations are resolved by later owning domains. A file's physical type (PDF) is different from its role (budget), source (KNBS), origin (curated/collected/derived), jurisdiction and permissions.

## Execution lifecycle and verification

1. Validate manifest, schemas, checksums and all dependencies without mutations. Resolve secrets from the environment without logging them.
2. Preview artifact registrations, reference/pattern inserts and concrete folder generation. Confirm recognized loaders and target database.
3. Upload/verify immutable artifacts in S3 and register filesystem records. Bootstrap the minimal filesystem schema/store directly in the approved database setup, then register the seed inputs after it exists; do not require filesystem tables before they can be created.
4. Apply prerequisite catalogs (file types/auth definitions/jurisdictions as appropriate), then dependent fixed folders and pattern definitions through parameterized domain loaders. Do not run arbitrary seed scripts automatically; explicitly allowlisted, versioned generators remain auditable.
5. Execute approved patterns only against actual input resources, record runs/output identity and create concrete folders lazily where specified. Subsequent generated folders can use actual jurisdiction/geography data once those foundations exist.
6. Verify row counts, parent/type/resource FKs, generated paths, scope and effective access. A repeat with unchanged inputs must converge without duplicates. Changed or removed entries require explicit reconciliation; absence is not automatic delete.

S3 and PostgreSQL are not one transaction: stage upload, verify, commit registry/row changes, record failures and retry safely. Do not blindly delete objects after a failed DB operation or cascade an orphan sweep across the existing bucket. Persist run/release state so interrupted application resumes without duplicate records.

The rewrite target database is `mzizi_new`; its schemas/data are disposable, without legacy ID or compatibility obligations. Existing S3 objects are not disposable. Keep newly created/test objects in a recognizable manifest/run namespace and do not migrate/delete existing keys without inspection and authorization.

## Adopted inputs

| Folder | Contents (file count) | Classification |
|---|---|---|
| `global/auth/` | namespaces, roles, role-permissions, scope-targets (CSV), bootstrap definition (YAML) | static curated, human-and-AI-assisted |
| `global/reference/` | media formats, site tags, source kinds, proof-of-concept countries | static curated (media formats internally derived), preparation unknown |
| `global/research/` | jurisdiction dossier rows | externally collected, AI-prepared, unverified |
| `global/sites/world-geoboundaries/` | site-structure bundle | externally collected, preparation unknown |
| `system/mappings/<bundle>/` | 17 importer mapping bundles (58 YAML files) | import mapping, preparation unknown |
| `system/policy/` | trusted domain suffixes | policy definition |
| `ke/reference/`, `ke/policy/`, `ke/patterns/`, `ke/governance/`, `ke/catalogues/`, `ke/registry/`, `ke/places/`, `ke/research/` | Kenya vocabularies, spellings, office patterns, governance structure, catalogues, registries, landmark places, site registry rows | see each `_folder.yaml` |
| `ke/sites/ke-iebc/`, `ke/sites/ke-parliament/` | site-structure bundles | externally collected, preparation unknown |

Test-only fixtures, samples and contract examples moved to `seed/fixtures/` (see above); legacy `api-legacy` CSVs stay with the legacy service. The per-file inventory, duplicate decisions and embedded-payload findings are in `.docs/docs/SEED_RELOCATION_INVENTORY.md`. No compatibility copies or symlinks exist at the old paths.

## Manifest-driven input contracts (2026-11-08)

The user requires source-neutral API/site acquisition via versioned api.structure.yaml and website manifests under root seed/, backed by DB source identities and approved release bindings. All system input-artifact schemas (seed/folder manifests, site/API structures, mappings, patterns and consumed JSON/YAML/CSV shapes) belong under source/schema/. Generic runtime packages stay under source/backend; publisher/country specifics belong in manifest/DB data. Dryv database/API authoring remains under dryv/ with explicit export ownership where contracts overlap. Follow [the detailed source requirements](https://github.com/alidantech-org/mzizi.africa/blob/develop/.docs/improvements/schema-redesign/source.md#2026-11-08--manifest-driven-api-and-website-sources-user-direction) for conflict-safe DB/YAML editing, pinned releases, learning/review and legacy extractor retirement. This documents future source/pipeline work, not a claim that manifest-driven runtime support is complete.
