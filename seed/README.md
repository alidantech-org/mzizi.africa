# Mzizi seed registry

`seed/` is the single repository home for all manually or AI-prepared bootstrap/seed inputs: auth role and permission definitions, global file types, jurisdiction lists, fixed folder definitions, folder patterns, site-structure YAML/JSON, mappings and seed-specific source-code artifacts. This user-directed convention was established on 8 November 2026. Runtime loaders, reusable validation, generation and S3 client code stay under `source/`; Dryv schema contracts stay under `dryv/`. Data payloads must not be hidden in loader code or copied into per-service fixture directories.

This README establishes the target convention. Existing seeds elsewhere have not yet been physically moved or their loaders rewritten. See the inventory and adoption notes below. The example manifest is deliberately disabled and references future payloads; no S3 upload, database seed or folder generation is performed by this documentation change.

## Target layout

| Repository path | Purpose |
|---|---|
| `seed/manifest.yaml` | Future root manifest: dependency-ordered includes and package identities; create when real payloads are adopted. |
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

The illustrative `manifest.example.json` is documentation, not an executable seed plan. A real manifest release must validate all paths and dependencies, reject traversal/cycles/missing or conflicting keys, verify checksums and reject unregistered loaders. Follow the filesystem/auth schemas once implemented; candidate target names in planning documents are not live tables.

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

## Existing scattered inputs and adoption work

Observed legacy locations include `source/backend/engine/database/fixtures/{reference,policy,research,patterns,seed,neutral-model}`, importer-embedded lists, and structure bundles under the data engine. Inspect and classify their actual consumers during adoption. Move reusable curated bootstrap inputs to the paths above; real synthetic test fixtures can remain adjacent to tests when they are solely test data, but any fixture used as a system seed must move here. Record file-by-file relocation and update loader paths atomically. No compatibility aliases or duplicated source-of-truth files are required for the approved rewrite.

The current publication establishes the convention and planning tasks only. It does not claim that old readers already support root manifests, that the entire legacy collection is consolidated, or that artifacts have been uploaded. No production folder taxonomy, file-type catalog or country seed data is generated in this change. Definitions and seed content are reviewed before adoption.
