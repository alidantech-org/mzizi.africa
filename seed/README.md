# Mzizi seed registry

`seed/` is the single repository home for all manually or AI-prepared bootstrap/seed inputs: auth role and permission definitions, global file types, jurisdiction lists, fixed folder definitions, folder patterns, site-structure YAML/JSON, mappings and seed-specific source-code artifacts. This user-directed convention was established on 8 November 2026. Runtime loaders, reusable validation, generation and S3 client code stay under `source/`; Dryv schema contracts stay under `dryv/`. Data payloads must not be hidden in loader code or copied into per-service fixture directories.

On 8 November 2026 the scattered system seeds were relocated here (task `TSK-0F4398B91D38`): the auth baseline, reference vocabularies, Kenyan catalogues and registries, policy, patterns, import mappings and site-structure bundles. `manifest.yaml` is a functional manifest of those inputs and `manifest.lock.json` is its generated lock. Nothing has been uploaded to S3: the lock records mappings and says `not_uploaded`. The disabled illustrative example moved to `examples/manifest.example.json`. The relocation inventory, duplicate decisions and non-adopted items are in `.docs/docs/SEED_RELOCATION_INVENTORY.md`.

## Entry points

Run from `source/backend/engine/database`:

```bash
bun src/seed.ts check     # validate folder metadata, manifest, dependencies, consumers and the lock (no writes)
bun src/seed.ts lock      # regenerate manifest.lock.json after changing a seed file or the manifest
bun src/seed.ts report    # effective metadata per artifact
bun src/rewrite.ts init   # create/update mzizi_new and apply seed/global/auth/ (idempotent, additive)
bun src/rewrite.ts bootstrap-admin   # first administrator; identity comes from the AUTH_BOOTSTRAP_* variables named in global/auth/bootstrap.yaml
bun test test/seed-registry.test.ts  # inheritance, manifest and auth-seed checks
```

Loaders that read these files stay under `source/`: `engine/database/src/{seed-auth,seeds,catalogue,governance-catalogue,patterns,media,assessments}.ts` (shared root: `seedRoot` in `config.ts`, override with `MZIZI_SEED_ROOT`) and `engine/data/src/mzizi_data/` (shared root: `seedroot.py`). Only `auth.*` entries target the rewrite database; the others still load the existing Dryv-entity database until the owning rewrite schemas exist, and their manifest entries say `legacy_dev_only`.

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

Inheritance, in order: (1) resolve descriptors from the seed root down to the containing folder; (2) for each field the nearest folder that sets it wins; (3) a deeper folder may set a more specific classification; (4) a per-file override applies last and only if listed with a reason; (5) a missing access policy resolves to `internal` and is warned; a missing role, acquisition class, preparation or scope is an error before registration; (6) nothing is inferred from folder names such as `generated` or `public`; (7) a folder cannot be less restrictive than an ancestor unless that ancestor sets `allow_weaker_children`, and `public` always needs its own `authorization`. Prefer a small correctly classified deeper folder over many overrides. `bun src/seed.ts check` enforces all of this; the root `_folder.yaml` sets `access: internal`.

## Manifest and lock

`manifest.yaml` is authored: entry `id`, `path` or `glob`, `loader` (allowlisted in `src/seed-manifest.ts`), `target`, `database_target_state`, `key_columns`, `depends_on`, `consumers` (files that must mention the path), `relocated_from` (historical origin path), `notes`, `sync_policy`. `manifest.lock.json` is generated and tracked: per file the SHA-256, size, media type, effective metadata, the descriptor each field was resolved from (`resolved_from`), `relocated_from`, bucket `mzizi` and a mapping `object_key` such as `internal/seeds/global/auth/roles/2026-11-08.1/roles.<sha16>.csv`, and `upload_status: not_uploaded`. A move never rewrites `relocated_from` or checksums retroactively: a new manifest release records the new location and the lock history stays in Git. Generator information is recorded as the tool, never a fabricated model or author.

## Ignored and generated inputs

`generated/`, `cache/`, `local/` are ignored by `seed/.gitignore`; none exists yet because nothing is generated. A generated seed output must get a descriptor with `preparation: programmatically_generated`, a manifest entry naming its generator and input entries, and a regeneration command in this README. Only the lock is a generated tracked file here (regenerate with `bun src/seed.ts lock`).

## Known limitations

- Preparation is `unknown` for `global/reference`, `system/mappings`, `system/policy`, `ke/reference` and the site bundles because the files do not say who prepared them; each carries `review.status: needs_review`. `bun src/seed.ts check` lists the warnings.
- Nothing is uploaded or registered: the filesystem milestone must implement descriptor inheritance in the registry and materialize effective provenance at registration (see task `TSK-3EA8C40B0F60`).
- `ke-iebc-catalogue.json` has no loader; `ke-orpp-catalogue.json` and `ke-priority-publishers-catalogue.json` are read only by tests.
- `global/filesystem/file-types.csv` and `ke/filesystem/folders.csv` do not exist yet. File formats are held by `global/reference/media-formats.json` (the authoritative source chosen over the legacy CSVs); the filesystem and reference tasks derive the CSV contracts and folder patterns.
- Non-auth loaders still target the legacy Dryv-entity database.

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

Test-only fixtures (`engine/database/fixtures/neutral-model`, `engine/data/samples`, `engine/data/tests/data`) deliberately stay beside tests; legacy `api-legacy` CSVs stay with the legacy service. The per-file inventory, duplicate decisions and embedded-payload findings are in `.docs/docs/SEED_RELOCATION_INVENTORY.md`. No compatibility copies or symlinks exist at the old paths.
