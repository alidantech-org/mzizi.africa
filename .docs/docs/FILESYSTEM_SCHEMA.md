---
{id: DOC-FILESYSTEM-SCHEMA,name: Filesystem schema and operations (implemented 2026-11-08),type: documentation,tags: [filesystem,schema,s3,seed]}
---

# Filesystem schema and operations

Implemented in local `mzizi_new` by task `TSK-3EA8C40B0F60`. SQL: `source/schema/database/filesystem/0001_filesystem.sql` (applied through `bun run db migrate`). Package: `source/packages/filesystem`. Engine endpoints: `source/backend/engine` (`/v1/filesystem/...`). Command: `uv run mzizi-filesystem`. The Python package still owns direct PostgreSQL filesystem persistence during the TypeScript database-owner migration. These decisions supersede the earlier object/file-type/variant/attachment proposals.

## Decisions

- **Codes follow one rule** (`.docs/rules/code-columns.md`): the column is always `code`; dot-separated lowercase segments; a child's code is its parent's code plus one segment computed by `filesystem.code_segment` (Python mirror `mzizi_filesystem.codes.code_segment`). Only root folders carry a hand-written code (`seeds`, `security`, `legacy_artifacts`); every folder and file below derives its code, so seed and manifest identities are reproducible. `filesystem.nearest_code` and the `files_code_guard` / `folders_guard` triggers check the prefix when a code is set.

- **Seven tables and one view:** tables `folders`, `files`, `file_versions`, `tags`, `taggings`, `file_relations`, `uploads`; view `paths`. No objects table: each version holds its S3 key, SHA-256, size, extension and content type directly. No file-type or extension tables: the normalized extension and the verified MIME type live on the version, validated against the shared catalog (`seed/global/reference/media-formats.json`) and file signatures.
- **Several versions may reference one physical key.** Keys are content-addressed per access prefix (`<access>/content/sha256/aa/bb/<sha256>`), so equal bytes in one access class share a key and different access classes never do. A key is never deleted while any retained version or live upload references it (`filesystem.key_in_use`).
- **Paths are derived**, never stored (`filesystem.folder_path`, `filesystem.file_path` and the single view `filesystem.paths` with `kind` folder or file). Moving or renaming a folder or file changes no S3 object.
- **Classification is inherited by folders** (access, artifact role, seed flag, acquisition class, preparation, jurisdiction): each field takes the nearest ancestor that sets it (`filesystem.effective_folder`, which also reports which folder supplied each field). Files carry no classification columns. No effective access defaults to `internal`.
- **Provenance is a snapshot on each version** (seed flag, artifact role, acquisition class, preparation, intended access, which folder or manifest definition supplied each field, manifest release, input references). Moving a file later never rewrites it.
- **Configuration is not data:** bucket, region and endpoint are never stored; no credentials or presigned URLs are stored.
- **Derivation links exact file versions** (`file_relations`: source version, derived version, relation kind). There is no `extracted_from_file_id`, no processed flag and no operations view: what ran, with which tool and configuration, and the status, are engine concerns (`engine_job_id` is an optional pointer).

## Tables

Generated from the live catalog of `mzizi_new`.

### `filesystem.folders`

Concrete logical hierarchy. The path is derived (filesystem.folder_path), never stored. Classification columns are NULL to inherit from the nearest ancestor that sets them (filesystem.effective_folder).

| Column | SQL type | Null | Default | Meaning |
|---|---|---|---|---|
| `id` | `uuid` | no | `uuidv7()` |  |
| `parent_id` | `uuid` | yes |  |  |
| `name` | `text` | no |  |  |
| `code` | `text` | yes |  | Stable unique hierarchical code (`.docs/rules/code-columns.md`); a coded folder sits under the nearest coded ancestor's code. Manifests use it as the folder identity. NULL when none. |
| `description` | `text` | yes |  |  |
| `access` | `text` | yes |  | Explicit access class; NULL inherits; no effective value defaults to internal (non-public). Only public/ is anonymously readable in S3; a deeper folder may not widen access unless the ancestor setting it has allow_weaker_children, and public needs access_authorization. |
| `access_authorization` | `jsonb` | yes |  | Required for public: {by, date, reference}. |
| `allow_weaker_children` | `boolean` | no | `false` | Whether folders below may be less restrictive than this folder's access. |
| `artifact_role` | `text` | yes |  | What artifacts in this folder are for (seed_input, backup, report, log, ...). Inherited. |
| `is_seed` | `boolean` | yes |  | Whether artifacts in this folder are seeds (NULL inherits; effective default false). Inherited. |
| `acquisition_class` | `text` | yes |  | How the content came to exist. Inherited. |
| `preparation` | `text` | yes |  | Who or what prepared the bytes; AI-prepared is not verified or publishable. Inherited. |
| `jurisdiction_code` | `text` | yes |  | Applicable jurisdiction (literal code). STAGED: a geography-unit reference with a real FK is added when the geography schema exists. Inherited. |
| `metadata` | `jsonb` | no | `'{}'::jsonb` | Definition source and review state of the classification (for example the descriptor file and review note). Not queried by logic. |
| `created_by` | `uuid` | yes |  |  |
| `created_at` | `timestamp with time zone` | no | `now()` |  |
| `updated_at` | `timestamp with time zone` | no | `now()` |  |
| `revision` | `integer` | no | `1` | Optimistic concurrency: incremented by every update; writers update WHERE revision = expected. |

**Constraints**

- Check `folders_access_check`: `CHECK ((access = ANY (ARRAY['public'::text, 'internal'::text, 'restricted'::text, 'private'::text])))`
- Check `folders_acquisition_class_check`: `CHECK ((acquisition_class = ANY (ARRAY['static_curated'::text, 'pattern_generated'::text, 'externally_collected'::text, 'internally_derived'::text])))`
- Check `folders_artifact_role_check`: `CHECK ((artifact_role = ANY (ARRAY['test_fixture'::text, 'seed_input'::text, 'pattern_definition'::text, 'site_structure'::text, 'import_mapping'::text, 'policy_definition'::text, 'research_registry'::text, 'generated_output'::text, 'evidence'::text, 'backup'::text, 'report'::text, 'log'::text, 'certificate'::text, 'object_store'::text])))`
- Check `folders_jurisdiction_code_check`: `CHECK ((jurisdiction_code ~ '^[a-z]{2,3}$'::text))`
- Check `folders_name_check`: `CHECK (((name = btrim(name)) AND ((length(name) >= 1) AND (length(name) <= 255)) AND (name !~ '[/[:cntrl:]]'::text) AND (name <> ALL (ARRAY['.'::text, '..'::text]))))`
- Check `folders_no_root_raw`: `CHECK (((parent_id IS NOT NULL) OR (name <> 'raw'::text)))`
- Check `folders_not_own_parent`: `CHECK (((parent_id IS NULL) OR (parent_id <> id)))`
- Check `folders_preparation_check`: `CHECK ((preparation = ANY (ARRAY['human_prepared'::text, 'ai_prepared'::text, 'human_and_ai_assisted'::text, 'programmatically_generated'::text, 'unknown'::text])))`
- Check `folders_public_is_authorized`: `CHECK (((access IS DISTINCT FROM 'public'::text) OR COALESCE(((access_authorization ? 'by'::text) AND (access_authorization ? 'date'::text) AND (access_authorization ? 'reference'::text)), false)))`
- Check `folders_revision_check`: `CHECK ((revision >= 1))`
- Check `folders_code_check`: `CHECK (code ~ '^[a-z0-9][a-z0-9_]*(\.[a-z0-9][a-z0-9_]*)*$' AND length(code) <= 255 AND at most 16 segments)`
- Foreign key `folders_created_by_fkey`: `FOREIGN KEY (created_by) REFERENCES auth.accounts(id)`
- Foreign key `folders_parent_id_fkey`: `FOREIGN KEY (parent_id) REFERENCES filesystem.folders(id) ON DELETE RESTRICT`
- Primary key `folders_pkey`: `PRIMARY KEY (id)`
- Unique `folders_code_key`: `UNIQUE (code)`

**Indexes**

- `CREATE INDEX folders_parent ON folders USING btree (parent_id) WHERE (parent_id IS NOT NULL)`
- `CREATE UNIQUE INDEX folders_sibling_names ON folders USING btree (parent_id, name) NULLS NOT DISTINCT`

**Triggers**: `folders_guard`, `folders_placement`, `folders_subtree_guard`, `folders_touch`

### `filesystem.files`

Stable logical file identity and placement. Content lives in file_versions; moving or renaming a file never touches S3.

| Column | SQL type | Null | Default | Meaning |
|---|---|---|---|---|
| `id` | `uuid` | no | `uuidv7()` |  |
| `folder_id` | `uuid` | no |  |  |
| `name` | `text` | no |  |  |
| `code` | `text` | yes |  | Stable unique hierarchical code (`.docs/rules/code-columns.md`): the code of its folder plus the file name segment (`seeds.global.auth.roles_csv`). NULL when its folders have no code. |
| `retention` | `text` | no | `'preserve_history'::text` | preserve_history: changed bytes add a retained version. replace_current: changed bytes replace the current content; unpinned superseded versions are dropped, pinned ones never. |
| `last_revision` | `integer` | no | `0` | Highest revision number issued, so numbers stay monotonic when replace_current drops old rows. |
| `current_version_id` | `uuid` | yes |  | The current content. Must belong to this file (composite FK) and exists by commit (deferred check). |
| `created_by` | `uuid` | yes |  |  |
| `created_at` | `timestamp with time zone` | no | `now()` |  |
| `updated_at` | `timestamp with time zone` | no | `now()` |  |
| `revision` | `integer` | no | `1` | Optimistic concurrency counter for conditional updates. |

**Constraints**

- Check `files_last_revision_check`: `CHECK ((last_revision >= 0))`
- Check `files_name_check`: `CHECK (((name = btrim(name)) AND ((length(name) >= 1) AND (length(name) <= 255)) AND (name !~ '[/[:cntrl:]]'::text) AND (name <> ALL (ARRAY['.'::text, '..'::text]))))`
- Check `files_code_check`: `CHECK (code ~ '^[a-z0-9][a-z0-9_]*(\.[a-z0-9][a-z0-9_]*)*$' AND length(code) <= 255 AND at most 16 segments)`
- Check `files_retention_check`: `CHECK ((retention = ANY (ARRAY['preserve_history'::text, 'replace_current'::text])))`
- Check `files_revision_check`: `CHECK ((revision >= 1))`
- Foreign key `files_created_by_fkey`: `FOREIGN KEY (created_by) REFERENCES auth.accounts(id)`
- Foreign key `files_current_version_belongs_to_file`: `FOREIGN KEY (id, current_version_id) REFERENCES filesystem.file_versions(file_id, id) DEFERRABLE INITIALLY DEFERRED`
- Foreign key `files_folder_id_fkey`: `FOREIGN KEY (folder_id) REFERENCES filesystem.folders(id) ON DELETE RESTRICT`
- Primary key `files_pkey`: `PRIMARY KEY (id)`
- Unique `files_folder_id_name_key`: `UNIQUE (folder_id, name)`
- Unique `files_code_key`: `UNIQUE (code)`

**Indexes**

- `CREATE INDEX files_folder ON files USING btree (folder_id)`

**Triggers**: `files_have_current_version`, `files_placement`, `files_touch`

### `filesystem.file_versions`

Exact content revisions. Several versions may reference one physical key (content-addressed, per access prefix): the key is never deleted while any retained reference exists. The S3 key prefix is the stored access boundary.

| Column | SQL type | Null | Default | Meaning |
|---|---|---|---|---|
| `id` | `uuid` | no | `uuidv7()` |  |
| `file_id` | `uuid` | no |  |  |
| `revision` | `integer` | no |  |  |
| `s3_key` | `text` | no |  | Object key in the configured bucket; prefix public\|internal\|restricted\|private equals the access at registration. No bucket, region, endpoint, credential or presigned URL is stored. |
| `sha256` | `text` | no |  | SHA-256 of the exact bytes, computed by streaming; identity of content, never the S3 ETag or the filename. |
| `size_bytes` | `bigint` | no |  |  |
| `extension` | `text` | yes |  | Normalized lower-case extension without dot, validated against the shared media catalog; not a file-type table. |
| `content_type` | `text` | no |  | Verified MIME type of these exact bytes (a revision may change format). |
| `original_filename` | `text` | yes |  |  |
| `provenance` | `jsonb` | no |  | Resolved historical provenance snapshot at registration: seed flag, artifact role, acquisition class, preparation, intended access, which folder/manifest definition supplied each field, manifest release. Never rewritten by later moves. |
| `pinned` | `boolean` | no | `false` | Pinned by a manifest release, evidence reference or run: never pruned. Taking part in a file relation also protects a version (file_relations FK). |
| `pin_reason` | `text` | yes |  |  |
| `created_by` | `uuid` | yes |  |  |
| `created_at` | `timestamp with time zone` | no | `now()` |  |

**Constraints**

- Check `file_versions_content_type_check`: `CHECK ((content_type ~ '^[a-z0-9][a-z0-9.+-]*/[a-z0-9][a-z0-9.+-]*$'::text))`
- Check `file_versions_extension_check`: `CHECK ((extension ~ '^[a-z0-9]{1,16}$'::text))`
- Check `file_versions_original_filename_check`: `CHECK (((length(original_filename) >= 1) AND (length(original_filename) <= 255)))`
- Check `file_versions_revision_check`: `CHECK ((revision >= 1))`
- Check `file_versions_s3_key_check`: `CHECK (((s3_key !~ '^/'::text) AND (s3_key !~ '(^\|/)\.\.(/\|$)'::text) AND (split_part(s3_key, '/'::text, 1) = ANY (ARRAY['public'::text, 'internal'::text, 'restricted'::text, 'private'::text])) AND (length(s3_key) <= 1024)))`
- Check `file_versions_sha256_check`: `CHECK ((sha256 ~ '^[0-9a-f]{64}$'::text))`
- Check `file_versions_size_bytes_check`: `CHECK ((size_bytes >= 0))`
- Check `versions_pin_reason`: `CHECK ((pinned = (pin_reason IS NOT NULL)))`
- Check `versions_provenance_is_object`: `CHECK ((jsonb_typeof(provenance) = 'object'::text))`
- Foreign key `file_versions_created_by_fkey`: `FOREIGN KEY (created_by) REFERENCES auth.accounts(id)`
- Foreign key `file_versions_file_id_fkey`: `FOREIGN KEY (file_id) REFERENCES filesystem.files(id) ON DELETE RESTRICT`
- Primary key `file_versions_pkey`: `PRIMARY KEY (id)`
- Unique `file_versions_file_id_id_key`: `UNIQUE (file_id, id)`
- Unique `file_versions_file_id_revision_key`: `UNIQUE (file_id, revision)`

**Indexes**

- `CREATE INDEX file_versions_content ON file_versions USING btree (sha256, size_bytes)`
- `CREATE INDEX file_versions_key ON file_versions USING btree (s3_key)`

**Triggers**: `versions_guard`, `versions_placement`

### `filesystem.tags`

The one tag vocabulary. Names are normalized lower-case, optionally namespaced (namespace:value).

| Column | SQL type | Null | Default | Meaning |
|---|---|---|---|---|
| `id` | `uuid` | no | `uuidv7()` |  |
| `name` | `text` | no |  |  |
| `description` | `text` | yes |  |  |
| `created_at` | `timestamp with time zone` | no | `now()` |  |

**Constraints**

- Check `tags_name_check`: `CHECK ((name ~ '^[a-z0-9][a-z0-9:_./-]{0,99}$'::text))`
- Primary key `tags_pkey`: `PRIMARY KEY (id)`
- Unique `tags_name_key`: `UNIQUE (name)`

### `filesystem.taggings`

Typed tag association: exactly one of file_id or folder_id, real FKs, no duplicate assignment. Removed with its target.

| Column | SQL type | Null | Default | Meaning |
|---|---|---|---|---|
| `id` | `uuid` | no | `uuidv7()` |  |
| `tag_id` | `uuid` | no |  |  |
| `file_id` | `uuid` | yes |  |  |
| `folder_id` | `uuid` | yes |  |  |
| `tagged_by` | `uuid` | yes |  |  |
| `created_at` | `timestamp with time zone` | no | `now()` |  |

**Constraints**

- Check `taggings_exactly_one_target`: `CHECK (((file_id IS NULL) <> (folder_id IS NULL)))`
- Foreign key `taggings_file_id_fkey`: `FOREIGN KEY (file_id) REFERENCES filesystem.files(id) ON DELETE CASCADE`
- Foreign key `taggings_folder_id_fkey`: `FOREIGN KEY (folder_id) REFERENCES filesystem.folders(id) ON DELETE CASCADE`
- Foreign key `taggings_tag_id_fkey`: `FOREIGN KEY (tag_id) REFERENCES filesystem.tags(id) ON DELETE RESTRICT`
- Foreign key `taggings_tagged_by_fkey`: `FOREIGN KEY (tagged_by) REFERENCES auth.accounts(id)`
- Primary key `taggings_pkey`: `PRIMARY KEY (id)`

**Indexes**

- `CREATE INDEX taggings_file ON taggings USING btree (file_id) WHERE (file_id IS NOT NULL)`
- `CREATE UNIQUE INDEX taggings_file_once ON taggings USING btree (tag_id, file_id) WHERE (file_id IS NOT NULL)`
- `CREATE INDEX taggings_folder ON taggings USING btree (folder_id) WHERE (folder_id IS NOT NULL)`
- `CREATE UNIQUE INDEX taggings_folder_once ON taggings USING btree (tag_id, folder_id) WHERE (folder_id IS NOT NULL)`

### `filesystem.file_relations`

Exact file version `derived_version_id` was derived from exact version `source_version_id` (converted, extracted, split, merged...). Only the relationship is stored; tools, configuration, status and scheduling are engine concerns. A version that takes part is never pruned.

| Column | SQL type | Null | Default | Meaning |
|---|---|---|---|---|
| `id` | `uuid` | no | `uuidv7()` |  |
| `source_version_id` | `uuid` | no |  | The version the derived one came from. |
| `derived_version_id` | `uuid` | no |  | The version produced from the source. |
| `relation` | `text` | no | `'derived_from'` | Kind of derivation, a lowercase slug. |
| `engine_job_id` | `uuid` | yes |  | Optional pointer to the engine job that produced it. |
| `created_by` | `uuid` | yes |  |  |
| `created_at` | `timestamptz` | no | `now()` |  |

**Constraints**: primary key `id`; foreign keys to `file_versions` (RESTRICT), `engine.jobs` and `auth.accounts`; `source_version_id <> derived_version_id`; unique `(source_version_id, derived_version_id, relation)`.

**Triggers**: `file_relations_guard` refuses a derivation that would create a cycle.

### `filesystem.uploads`

Temporary upload sessions (direct-to-S3 or sync staging). temp_key is always under private/tmp/uploads/. The lease is renewed by activity; expires_at is the hard limit. Cleanup aborts expired multipart uploads, removes only owned temporary objects, keeps completed file records and trims old session metadata in bounded batches.

| Column | SQL type | Null | Default | Meaning |
|---|---|---|---|---|
| `id` | `uuid` | no | `uuidv7()` |  |
| `folder_id` | `uuid` | no |  |  |
| `filename` | `text` | no |  |  |
| `declared_sha256` | `text` | yes |  |  |
| `declared_size` | `bigint` | yes |  |  |
| `temp_key` | `text` | no |  |  |
| `multipart_id` | `text` | yes |  |  |
| `status` | `text` | no | `'pending'::text` |  |
| `lease_expires_at` | `timestamp with time zone` | no |  |  |
| `expires_at` | `timestamp with time zone` | no |  |  |
| `file_version_id` | `uuid` | yes |  | The registered version once completed; kept (set null) if the version is later pruned. |
| `created_by` | `uuid` | yes |  |  |
| `created_at` | `timestamp with time zone` | no | `now()` |  |
| `completed_at` | `timestamp with time zone` | yes |  |  |
| `error` | `text` | yes |  |  |

**Constraints**

- Check `uploads_completed_has_time`: `CHECK (((status = 'completed'::text) = (completed_at IS NOT NULL)))`
- Check `uploads_declared_sha256_check`: `CHECK ((declared_sha256 ~ '^[0-9a-f]{64}$'::text))`
- Check `uploads_declared_size_check`: `CHECK ((declared_size >= 0))`
- Check `uploads_filename_check`: `CHECK (((length(filename) >= 1) AND (length(filename) <= 255)))`
- Check `uploads_lease_within_expiry`: `CHECK ((lease_expires_at <= expires_at))`
- Check `uploads_status_check`: `CHECK ((status = ANY (ARRAY['pending'::text, 'uploaded'::text, 'completed'::text, 'failed'::text, 'abandoned'::text])))`
- Check `uploads_temp_key_check`: `CHECK ((temp_key ~ '^private/tmp/uploads/'::text))`
- Foreign key `uploads_created_by_fkey`: `FOREIGN KEY (created_by) REFERENCES auth.accounts(id)`
- Foreign key `uploads_file_version_id_fkey`: `FOREIGN KEY (file_version_id) REFERENCES filesystem.file_versions(id) ON DELETE SET NULL`
- Foreign key `uploads_folder_id_fkey`: `FOREIGN KEY (folder_id) REFERENCES filesystem.folders(id) ON DELETE RESTRICT`
- Primary key `uploads_pkey`: `PRIMARY KEY (id)`
- Unique `uploads_temp_key_key`: `UNIQUE (temp_key)`

**Indexes**

- `CREATE INDEX uploads_finished ON uploads USING btree (created_at) WHERE (status = ANY (ARRAY['completed'::text, 'failed'::text, 'abandoned'::text]))`
- `CREATE INDEX uploads_open ON uploads USING btree (expires_at) WHERE (status = ANY (ARRAY['pending'::text, 'uploaded'::text]))`

## Rules enforced in the database

- **Hierarchy:** sibling names unique per parent including roots (`UNIQUE NULLS NOT DISTINCT`), names cannot contain `/` or control characters, no cycles, depth at most 16, no root folder named `raw` (the historical raw collection is not re-created).
- **Access widening:** a folder may not be less restrictive than the nearest ancestor that sets access unless that ancestor has `allow_weaker_children`; `public` needs an `access_authorization` (`by`, `date`, `reference`); making a parent stricter than an explicitly weaker descendant is refused.
- **Placement equals access, checked at commit:** the S3 key prefix of every retained version must equal the effective access of its file's folder (deferred constraint triggers on folders, files and versions). A database access change alone therefore cannot change visibility; `transition_folder_access` relocates keys and the folder in one transaction.
- **File/version cycle:** a file is created without a current pointer, its first version is inserted, and the pointer is set in one transaction; the deferred composite foreign key proves the current version belongs to the same file, and a deferred trigger rejects a committed file without a current version.
- **Versions** are immutable except pinning and key relocation; revisions are monotonic per file (`files.last_revision`); the current version, pinned versions and versions used by an extraction cannot be deleted.
- **Tagging:** exactly one of file or folder, no duplicates (partial unique indexes), real foreign keys, removed with the target.
- **Deletion behavior:** `folders` and `files` use RESTRICT; versions are removed only through the retention paths (replace-current pruning or `Repository.delete_file`); taggings cascade with their target; `file_relations` RESTRICT both versions they link.

## Version retention and replacement

Per logical file (`files.retention`, defaulted from the sync manifest):

- `preserve_history` (default): changed bytes add a retained version; unchanged bytes add nothing.
- `replace_current`: changed bytes become the current version and superseded versions are dropped unless pinned or used by a file relation. Their S3 keys are returned for explicit cleanup and are never deleted by publication.

Anything pinned (manifest-release pins set by the seed sync, `pin_reason`) or taking part in a file relation survives both modes. Updates are conditional on `files.revision`; a lost race is reported as a conflict.

## Hashing and deduplication

Bytes are hashed by streaming SHA-256 while counting size (`hash_file`, `hash_stream`). Before uploading, the registry is asked for an existing version with the same hash and size under the same access prefix; if found its key is reused and nothing is uploaded. Deduplication never uses file names or ETags, never merges distinct logical identities (each keeps its own `files` row), never crosses access boundaries (so private bytes can never become public), and the API does not expose whether storage was shared.

## Synchronization

`uv run mzizi-filesystem sync --manifest <manifest>` previews by default; `--apply --actor <account>` writes. Manifests: the root seed manifest (`seed/manifest.yaml`, classification from the folder descriptors and lock) and generic sync manifests validated against `source/schema/filesystem/sync-manifest.schema.json` (named fields and globs only; identity is the registry code, optional `identities` keep a local rename on its logical file). Behavior: folders are created parent-first with inherited or explicit metadata; files are hashed, deduplicated, uploaded and verified, then registered; results are created, unchanged, updated, conflict, failed, denied or blocked; reruns are idempotent; an upload that finished before a database failure is recovered by hash on the next run; content missing from S3 for a registered version is re-uploaded; files that disappear locally are never deleted remotely; credential-like names and private keys are blocked; `.data/raw` and any `raw` root are refused.

S3 and PostgreSQL do not share a transaction. Order of operations makes interruption safe: write the immutable hash-addressed key and verify it, then commit the registry rows atomically.

## Uploads and cleanup

`create_upload` reserves a key under `private/tmp/uploads/` and returns a presigned PUT (client-reachable host only); `complete_upload` streams and hashes the stored bytes, rejects mismatches, copies to the content key of the destination access class, registers file and version, and removes only its own temporary object. `cleanup_uploads` (dry run by default, bounded batches) abandons sessions whose lease or expiry lapsed, aborts their multipart uploads, removes only their own temp objects, and trims old session metadata; completed file records and shared content are never touched.

## Authorization

The `filesystem` namespace (`read`, `edit`, `review`, `publish`, `export`, `delete`) is registered in the `auth` seed; `filesystem.folders` is a scope target (a grant on a folder covers it and everything below) and `filesystem.folders` and `filesystem.files` are governed tables linked through the folder. Edit covers folder creation, uploads, replacement and moves (both ends checked with `auth.can_change`); read covers downloads and lineage; publish covers access changes; delete covers cleanup. The rules remain in the PostgreSQL `auth` functions. Runtime filesystem API authorization now calls named TypeScript database-service operations that wrap `auth.can_link`, `auth.can` and `auth.can_change`; metadata access still uses the Python repository pending its owner migration. Role `filesystem_manager` bundles all six actions. Operator mode (no actor) exists only for local repository commands.

## S3 contract

Bucket `mzizi`, region `us-east-1`, path-style addressing, credentials from the existing environment (`S3_ENDPOINT`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, optional `S3_PUBLIC_ENDPOINT` and `S3_PUBLIC_ORIGIN`). Laptop endpoint `http://192.168.100.13:18333`; production Docker endpoint `http://object-storage:8333` (network `home-services`); public origin `https://res.alidantech.org/mzizi/`. Only `public/` is anonymously readable. Private reads use authorization plus backend streaming or presigned URLs signed against `S3_PUBLIC_ENDPOINT`; an internal single-label hostname is refused. No bucket, credential or infrastructure is created and no existing object is moved, reclassified or deleted by these tools.

## Source-linking interface (for later source work)

`Repository.ensure`-style primitives take neutral inputs (folder id, name, code, classification, provenance extras); nothing in the package names KNBS, IEBC, Kenya or a website. Later source tasks resolve a learned source to folders through manifests, resource relationships and approved reference-owned patterns and call the same service (`FilesystemService.register`, `run_sync`, `begin_extraction`).

## Known gaps

No live S3 operation has been verified from this checkout unless the S3 variables were present (see the task record); multipart upload orchestration by the client is the caller's job (sessions, abort and completion verification exist); folder trees and the global file-type CSV remain reference-pattern work; geography references on folders wait for the geography schema (`jurisdiction_code` is a literal code); the engine API has no SSE events for filesystem changes yet.
