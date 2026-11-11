-- Filesystem schema for the disposable rewrite database (mzizi_new). Seven tables and one view; see .docs/docs/FILESYSTEM_SCHEMA.md.
-- Decisions (2026-11-08): explicit file versions hold the S3 key, hash, size, extension and content type directly (no objects table);
-- no file-type or extension tables; paths are derived from the folder hierarchy; classification is inherited by folders and resolved
-- deterministically; S3 configuration (bucket, region, endpoint) is never stored in rows; no credentials or presigned URLs are stored.

CREATE SCHEMA filesystem;
COMMENT ON SCHEMA filesystem IS 'Logical folders, files, exact content versions with S3 keys, tags, derivation relations between file versions and upload sessions. Bucket/region/endpoint live in configuration, never in rows.';

-- Codes follow .docs/rules/code-columns.md: dot-separated lowercase segments, hierarchical by prefix.
CREATE FUNCTION filesystem.code_segment(p_text text) RETURNS text LANGUAGE sql IMMUTABLE STRICT AS $$
  SELECT btrim(regexp_replace(lower(p_text), '[^a-z0-9]+', '_', 'g'), '_') $$;
COMMENT ON FUNCTION filesystem.code_segment(text) IS 'The one reproducible way to turn a name into a code segment: lowercase, every run outside a-z0-9 becomes one underscore, outer underscores removed. Mirrored by mzizi_filesystem.codes.code_segment.';

-- ------------------------------------------------------------------------------------------------ folders
CREATE TABLE filesystem.folders (
  id                   uuid PRIMARY KEY DEFAULT uuidv7(),
  parent_id            uuid REFERENCES filesystem.folders (id) ON DELETE RESTRICT,
  name                 text NOT NULL CHECK (name = btrim(name) AND length(name) BETWEEN 1 AND 255 AND name !~ '[/[:cntrl:]]' AND name NOT IN ('.', '..')),
  code                 text UNIQUE CHECK (code ~ '^[a-z0-9][a-z0-9_]*(\.[a-z0-9][a-z0-9_]*)*$' AND length(code) <= 255 AND cardinality(string_to_array(code, '.')) <= 16),
  description          text,
  access               text CHECK (access IN ('public', 'internal', 'restricted', 'private')),
  access_authorization jsonb,
  allow_weaker_children boolean NOT NULL DEFAULT false,
  artifact_role        text CHECK (artifact_role IN ('test_fixture', 'seed_input', 'pattern_definition', 'site_structure', 'import_mapping', 'policy_definition', 'research_registry', 'generated_output', 'evidence', 'backup', 'report', 'log', 'certificate', 'object_store')),
  is_seed              boolean,
  acquisition_class    text CHECK (acquisition_class IN ('static_curated', 'pattern_generated', 'externally_collected', 'internally_derived')),
  preparation          text CHECK (preparation IN ('human_prepared', 'ai_prepared', 'human_and_ai_assisted', 'programmatically_generated', 'unknown')),
  jurisdiction_code    text CHECK (jurisdiction_code ~ '^[a-z]{2,3}$'),
  metadata             jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by           uuid REFERENCES auth.accounts (id),
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),
  revision             integer NOT NULL DEFAULT 1 CHECK (revision >= 1),
  CONSTRAINT folders_not_own_parent CHECK (parent_id IS NULL OR parent_id <> id),
  CONSTRAINT folders_no_root_raw CHECK (parent_id IS NOT NULL OR name <> 'raw'),
  CONSTRAINT folders_public_is_authorized CHECK (access IS DISTINCT FROM 'public' OR coalesce(access_authorization ? 'by' AND access_authorization ? 'date' AND access_authorization ? 'reference', false))
);
CREATE UNIQUE INDEX folders_sibling_names ON filesystem.folders (parent_id, name) NULLS NOT DISTINCT;
CREATE INDEX folders_parent ON filesystem.folders (parent_id) WHERE parent_id IS NOT NULL;
COMMENT ON CONSTRAINT folders_no_root_raw ON filesystem.folders IS 'The historical raw collection is not re-created as a logical root; it awaits separate reconciliation.';
COMMENT ON TABLE filesystem.folders IS 'Concrete logical hierarchy. The path is derived (filesystem.folder_path), never stored. Classification columns are NULL to inherit from the nearest ancestor that sets them (filesystem.effective_folder).';
COMMENT ON COLUMN filesystem.folders.code IS 'Stable unique code of a folder; any folder may carry one and manifests use it as the folder''s identity. NULL when the folder has none.';
COMMENT ON COLUMN filesystem.folders.access IS 'Explicit access class; NULL inherits; no effective value defaults to internal (non-public). Only public/ is anonymously readable in S3; a deeper folder may not widen access unless the ancestor setting it has allow_weaker_children, and public needs access_authorization.';
COMMENT ON COLUMN filesystem.folders.access_authorization IS 'Required for public: {by, date, reference}.';
COMMENT ON COLUMN filesystem.folders.allow_weaker_children IS 'Whether folders below may be less restrictive than this folder''s access.';
COMMENT ON COLUMN filesystem.folders.artifact_role IS 'What artifacts in this folder are for (seed_input, backup, report, log, ...). Inherited.';
COMMENT ON COLUMN filesystem.folders.is_seed IS 'Whether artifacts in this folder are seeds (NULL inherits; effective default false). Inherited.';
COMMENT ON COLUMN filesystem.folders.acquisition_class IS 'How the content came to exist. Inherited.';
COMMENT ON COLUMN filesystem.folders.preparation IS 'Who or what prepared the bytes; AI-prepared is not verified or publishable. Inherited.';
COMMENT ON COLUMN filesystem.folders.jurisdiction_code IS 'Applicable jurisdiction (literal code). STAGED: a geography-unit reference with a real FK is added when the geography schema exists. Inherited.';
COMMENT ON COLUMN filesystem.folders.metadata IS 'Definition source and review state of the classification (for example the descriptor file and review note). Not queried by logic.';
COMMENT ON COLUMN filesystem.folders.revision IS 'Optimistic concurrency: incremented by every update; writers update WHERE revision = expected.';

-- ---------------------------------------------------------------------------------------------- files
CREATE TABLE filesystem.files (
  id                 uuid PRIMARY KEY DEFAULT uuidv7(),
  folder_id          uuid NOT NULL REFERENCES filesystem.folders (id) ON DELETE RESTRICT,
  name               text NOT NULL CHECK (name = btrim(name) AND length(name) BETWEEN 1 AND 255 AND name !~ '[/[:cntrl:]]' AND name NOT IN ('.', '..')),
  code               text UNIQUE CHECK (code ~ '^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*)*$' AND length(code) <= 255 AND cardinality(string_to_array(code, '.')) <= 16),
  retention          text NOT NULL DEFAULT 'preserve_history' CHECK (retention IN ('preserve_history', 'replace_current')),
  last_revision      integer NOT NULL DEFAULT 0 CHECK (last_revision >= 0),
  current_version_id uuid,
  created_by         uuid REFERENCES auth.accounts (id),
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),
  revision           integer NOT NULL DEFAULT 1 CHECK (revision >= 1),
  UNIQUE (folder_id, name)
);
CREATE INDEX files_folder ON filesystem.files (folder_id);
COMMENT ON TABLE filesystem.files IS 'Stable logical file identity and placement. Content lives in file_versions; moving or renaming a file never touches S3.';
COMMENT ON COLUMN filesystem.files.code IS 'Stable unique hierarchical code (.docs/rules/code-columns.md): the code of its folder plus the file name segment. Set when the file is registered from a manifest or seed; NULL when none.';
COMMENT ON COLUMN filesystem.files.retention IS 'preserve_history: changed bytes add a retained version. replace_current: changed bytes replace the current content; unpinned superseded versions are dropped, pinned ones never.';
COMMENT ON COLUMN filesystem.files.last_revision IS 'Highest revision number issued, so numbers stay monotonic when replace_current drops old rows.';
COMMENT ON COLUMN filesystem.files.current_version_id IS 'The current content. Must belong to this file (composite FK) and exists by commit (deferred check).';
COMMENT ON COLUMN filesystem.files.revision IS 'Optimistic concurrency counter for conditional updates.';

-- --------------------------------------------------------------------------------------- file_versions
CREATE TABLE filesystem.file_versions (
  id                uuid PRIMARY KEY DEFAULT uuidv7(),
  file_id           uuid NOT NULL REFERENCES filesystem.files (id) ON DELETE RESTRICT,
  revision          integer NOT NULL CHECK (revision >= 1),
  s3_key            text NOT NULL CHECK (s3_key !~ '^/' AND s3_key !~ '(^|/)\.\.(/|$)' AND split_part(s3_key, '/', 1) IN ('public', 'internal', 'restricted', 'private') AND length(s3_key) <= 1024),
  sha256            text NOT NULL CHECK (sha256 ~ '^[0-9a-f]{64}$'),
  size_bytes        bigint NOT NULL CHECK (size_bytes >= 0),
  extension         text CHECK (extension ~ '^[a-z0-9]{1,16}$'),
  content_type      text NOT NULL CHECK (content_type ~ '^[a-z0-9][a-z0-9.+-]*/[a-z0-9][a-z0-9.+-]*$'),
  original_filename text CHECK (length(original_filename) BETWEEN 1 AND 255),
  provenance        jsonb NOT NULL,
  pinned            boolean NOT NULL DEFAULT false,
  pin_reason        text,
  created_by        uuid REFERENCES auth.accounts (id),
  created_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (file_id, revision),
  UNIQUE (file_id, id),
  CONSTRAINT versions_pin_reason CHECK (pinned = (pin_reason IS NOT NULL)),
  CONSTRAINT versions_provenance_is_object CHECK (jsonb_typeof(provenance) = 'object')
);
CREATE INDEX file_versions_key ON filesystem.file_versions (s3_key);
CREATE INDEX file_versions_content ON filesystem.file_versions (sha256, size_bytes);
COMMENT ON TABLE filesystem.file_versions IS 'Exact content revisions. Several versions may reference one physical key (content-addressed, per access prefix): the key is never deleted while any retained reference exists. The S3 key prefix is the stored access boundary.';
COMMENT ON COLUMN filesystem.file_versions.s3_key IS 'Object key in the configured bucket; prefix public|internal|restricted|private equals the access at registration. No bucket, region, endpoint, credential or presigned URL is stored.';
COMMENT ON COLUMN filesystem.file_versions.sha256 IS 'SHA-256 of the exact bytes, computed by streaming; identity of content, never the S3 ETag or the filename.';
COMMENT ON COLUMN filesystem.file_versions.extension IS 'Normalized lower-case extension without dot, validated against the shared media catalog; not a file-type table.';
COMMENT ON COLUMN filesystem.file_versions.content_type IS 'Verified MIME type of these exact bytes (a revision may change format).';
COMMENT ON COLUMN filesystem.file_versions.provenance IS 'Resolved historical provenance snapshot at registration: seed flag, artifact role, acquisition class, preparation, intended access, which folder/manifest definition supplied each field, manifest release. Never rewritten by later moves.';
COMMENT ON COLUMN filesystem.file_versions.pinned IS 'Pinned by a manifest release, evidence reference or run: never pruned. Taking part in a file relation also protects a version (file_relations FK).';

ALTER TABLE filesystem.files
  ADD CONSTRAINT files_current_version_belongs_to_file FOREIGN KEY (id, current_version_id) REFERENCES filesystem.file_versions (file_id, id) DEFERRABLE INITIALLY DEFERRED;

-- ------------------------------------------------------------------------------------------ tags
CREATE TABLE filesystem.tags (
  id          uuid PRIMARY KEY DEFAULT uuidv7(),
  name        text NOT NULL UNIQUE CHECK (name ~ '^[a-z0-9][a-z0-9:_./-]{0,99}$'),
  description text,
  created_at  timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE filesystem.tags IS 'The one tag vocabulary. Names are normalized lower-case, optionally namespaced (namespace:value).';

CREATE TABLE filesystem.taggings (
  id         uuid PRIMARY KEY DEFAULT uuidv7(),
  tag_id     uuid NOT NULL REFERENCES filesystem.tags (id) ON DELETE RESTRICT,
  file_id    uuid REFERENCES filesystem.files (id) ON DELETE CASCADE,
  folder_id  uuid REFERENCES filesystem.folders (id) ON DELETE CASCADE,
  tagged_by  uuid REFERENCES auth.accounts (id),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT taggings_exactly_one_target CHECK ((file_id IS NULL) <> (folder_id IS NULL))
);
CREATE UNIQUE INDEX taggings_file_once ON filesystem.taggings (tag_id, file_id) WHERE file_id IS NOT NULL;
CREATE UNIQUE INDEX taggings_folder_once ON filesystem.taggings (tag_id, folder_id) WHERE folder_id IS NOT NULL;
CREATE INDEX taggings_file ON filesystem.taggings (file_id) WHERE file_id IS NOT NULL;
CREATE INDEX taggings_folder ON filesystem.taggings (folder_id) WHERE folder_id IS NOT NULL;
COMMENT ON TABLE filesystem.taggings IS 'Typed tag association: exactly one of file_id or folder_id, real FKs, no duplicate assignment. Removed with its target.';

-- ------------------------------------------------------------------------------------ file_relations
-- Only the relationship is stored here. What ran, with which tool, configuration and schedule belongs to the engine (engine_job_id links).
CREATE TABLE filesystem.file_relations (
  id                 uuid PRIMARY KEY DEFAULT uuidv7(),
  source_version_id  uuid NOT NULL REFERENCES filesystem.file_versions (id) ON DELETE RESTRICT,
  derived_version_id uuid NOT NULL REFERENCES filesystem.file_versions (id) ON DELETE RESTRICT,
  relation           text NOT NULL DEFAULT 'derived_from' CHECK (relation ~ '^[a-z][a-z0-9_.-]*$'),
  engine_job_id      uuid REFERENCES engine.jobs (id),
  created_by         uuid REFERENCES auth.accounts (id),
  created_at         timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT file_relations_distinct CHECK (source_version_id <> derived_version_id),
  CONSTRAINT file_relations_once UNIQUE (source_version_id, derived_version_id, relation)
);
CREATE INDEX file_relations_derived ON filesystem.file_relations (derived_version_id);
CREATE INDEX file_relations_job ON filesystem.file_relations (engine_job_id) WHERE engine_job_id IS NOT NULL;
COMMENT ON TABLE filesystem.file_relations IS 'Exact file version derived_version_id was derived from exact version source_version_id (converted, extracted, split...). A version that takes part is never pruned. Tools, configuration, status and scheduling are engine concerns; engine_job_id is an optional pointer only.';
COMMENT ON COLUMN filesystem.file_relations.relation IS 'Kind of derivation, a lowercase slug (default derived_from).';

-- ------------------------------------------------------------------------------------------- uploads
CREATE TABLE filesystem.uploads (
  id                uuid PRIMARY KEY DEFAULT uuidv7(),
  folder_id         uuid NOT NULL REFERENCES filesystem.folders (id) ON DELETE RESTRICT,
  filename          text NOT NULL CHECK (length(filename) BETWEEN 1 AND 255),
  declared_sha256   text CHECK (declared_sha256 ~ '^[0-9a-f]{64}$'),
  declared_size     bigint CHECK (declared_size >= 0),
  temp_key          text NOT NULL UNIQUE CHECK (temp_key ~ '^private/tmp/uploads/'),
  multipart_id      text,
  status            text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'uploaded', 'completed', 'failed', 'abandoned')),
  lease_expires_at  timestamptz NOT NULL,
  expires_at        timestamptz NOT NULL,
  file_version_id   uuid REFERENCES filesystem.file_versions (id) ON DELETE SET NULL,
  created_by        uuid REFERENCES auth.accounts (id),
  created_at        timestamptz NOT NULL DEFAULT now(),
  completed_at      timestamptz,
  error             text,
  CONSTRAINT uploads_completed_has_time CHECK ((status = 'completed') = (completed_at IS NOT NULL)),
  CONSTRAINT uploads_lease_within_expiry CHECK (lease_expires_at <= expires_at)
);
CREATE INDEX uploads_open ON filesystem.uploads (expires_at) WHERE status IN ('pending', 'uploaded');
CREATE INDEX uploads_finished ON filesystem.uploads (created_at) WHERE status IN ('completed', 'failed', 'abandoned');
COMMENT ON TABLE filesystem.uploads IS 'Temporary upload sessions (direct-to-S3 or sync staging). temp_key is always under private/tmp/uploads/. The lease is renewed by activity; expires_at is the hard limit. Cleanup aborts expired multipart uploads, removes only owned temporary objects, keeps completed file records and trims old session metadata in bounded batches.';
COMMENT ON COLUMN filesystem.uploads.file_version_id IS 'The registered version once completed; kept (set null) if the version is later pruned.';

-- ================================================================================= derivations and rules
CREATE FUNCTION filesystem.touch() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at := now(); NEW.revision := OLD.revision + 1; RETURN NEW; END $$;
CREATE TRIGGER folders_touch BEFORE UPDATE ON filesystem.folders FOR EACH ROW EXECUTE FUNCTION filesystem.touch();
CREATE TRIGGER files_touch BEFORE UPDATE ON filesystem.files FOR EACH ROW EXECUTE FUNCTION filesystem.touch();

-- Derived paths (never stored). Folder ids are the identity; a path is only a rendering of the hierarchy.
CREATE FUNCTION filesystem.folder_path(p_id uuid) RETURNS text LANGUAGE sql STABLE AS $$
  WITH RECURSIVE up(id, parent_id, name, depth) AS (
    SELECT id, parent_id, name, 0 FROM filesystem.folders WHERE id = p_id
    UNION ALL SELECT f.id, f.parent_id, f.name, up.depth + 1 FROM filesystem.folders f JOIN up ON f.id = up.parent_id WHERE up.depth < 32)
  SELECT '/' || string_agg(name, '/' ORDER BY depth DESC) FROM up $$;
CREATE FUNCTION filesystem.file_path(p_id uuid) RETURNS text LANGUAGE sql STABLE AS $$
  SELECT filesystem.folder_path(folder_id) || '/' || name FROM filesystem.files WHERE id = p_id $$;
CREATE VIEW filesystem.paths AS
  SELECT 'folder'::text AS kind, id, filesystem.folder_path(id) AS path FROM filesystem.folders
  UNION ALL
  SELECT 'file'::text, id, filesystem.file_path(id) FROM filesystem.files;
COMMENT ON VIEW filesystem.paths IS 'Derived paths of every folder and file (kind = folder|file). There is no competing stored path identity.';

CREATE FUNCTION filesystem.access_rank(p_access text) RETURNS int LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE p_access WHEN 'public' THEN 0 WHEN 'internal' THEN 1 WHEN 'restricted' THEN 2 WHEN 'private' THEN 3 END $$;

-- Deterministic inheritance: for each field the nearest folder (self first, then ancestors) that sets it wins.
CREATE FUNCTION filesystem.effective_folder(p_id uuid)
RETURNS TABLE (access text, access_defaulted boolean, artifact_role text, is_seed boolean, acquisition_class text, preparation text, jurisdiction_code text, resolved_from jsonb)
LANGUAGE plpgsql STABLE AS $$
DECLARE r record; v_access text; v_role text; v_seed boolean; v_acq text; v_prep text; v_juris text; src jsonb := '{}'::jsonb;
BEGIN
  FOR r IN WITH RECURSIVE up AS (
             SELECT f.*, 0 AS depth FROM filesystem.folders f WHERE f.id = p_id
             UNION ALL SELECT f.*, up.depth + 1 FROM filesystem.folders f JOIN up ON f.id = up.parent_id WHERE up.depth < 32)
           SELECT * FROM up ORDER BY depth LOOP
    IF v_access IS NULL AND r.access IS NOT NULL THEN v_access := r.access; src := src || jsonb_build_object('access', r.id); END IF;
    IF v_role IS NULL AND r.artifact_role IS NOT NULL THEN v_role := r.artifact_role; src := src || jsonb_build_object('artifact_role', r.id); END IF;
    IF v_seed IS NULL AND r.is_seed IS NOT NULL THEN v_seed := r.is_seed; src := src || jsonb_build_object('is_seed', r.id); END IF;
    IF v_acq IS NULL AND r.acquisition_class IS NOT NULL THEN v_acq := r.acquisition_class; src := src || jsonb_build_object('acquisition_class', r.id); END IF;
    IF v_prep IS NULL AND r.preparation IS NOT NULL THEN v_prep := r.preparation; src := src || jsonb_build_object('preparation', r.id); END IF;
    IF v_juris IS NULL AND r.jurisdiction_code IS NOT NULL THEN v_juris := r.jurisdiction_code; src := src || jsonb_build_object('jurisdiction_code', r.id); END IF;
  END LOOP;
  RETURN QUERY SELECT coalesce(v_access, 'internal'), v_access IS NULL, v_role, coalesce(v_seed, false), v_acq, v_prep, v_juris, src;
END $$;
COMMENT ON FUNCTION filesystem.effective_folder(uuid) IS 'Effective classification of a folder: nearest explicit value per field; access defaults to internal; resolved_from names the folder that supplied each field.';

-- Cycles, depth, and the access-widening rule for inserts, moves and access changes.
CREATE FUNCTION filesystem.nearest_code(p_folder uuid) RETURNS text LANGUAGE sql STABLE AS $$
  WITH RECURSIVE up(id, parent_id, code, depth) AS (
    SELECT id, parent_id, code, 0 FROM filesystem.folders WHERE id = p_folder
    UNION ALL SELECT f.id, f.parent_id, f.code, up.depth + 1 FROM filesystem.folders f JOIN up ON f.id = up.parent_id WHERE up.depth < 32)
  SELECT code FROM up WHERE code IS NOT NULL ORDER BY depth LIMIT 1 $$;
COMMENT ON FUNCTION filesystem.nearest_code(uuid) IS 'Code of the folder or of its nearest coded ancestor; NULL when none.';

CREATE FUNCTION filesystem.files_code_guard() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE folder_code text;
BEGIN
  folder_code := filesystem.nearest_code(NEW.folder_id);
  IF NEW.code IS NOT NULL AND folder_code IS NOT NULL AND left(NEW.code, length(folder_code) + 1) <> folder_code || '.' THEN
    RAISE EXCEPTION 'file code % must sit under its folder code %', NEW.code, folder_code USING ERRCODE = 'MZ002';
  END IF;
  RETURN NEW;
END $$;
CREATE FUNCTION filesystem.folders_guard() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE cur uuid := NEW.parent_id; depth int := 1; anc record; parent_eff text; setter record; parent_code text;
BEGIN
  WHILE cur IS NOT NULL LOOP
    IF TG_OP = 'UPDATE' AND cur = NEW.id THEN RAISE EXCEPTION 'folder hierarchy cannot contain a cycle' USING ERRCODE = 'MZ002'; END IF;
    depth := depth + 1;
    IF depth > 16 THEN RAISE EXCEPTION 'folders may be nested at most 16 deep' USING ERRCODE = 'MZ002'; END IF;
    SELECT parent_id INTO cur FROM filesystem.folders WHERE id = cur;
  END LOOP;
  IF NEW.code IS NOT NULL AND NEW.parent_id IS NOT NULL THEN
    parent_code := filesystem.nearest_code(NEW.parent_id);
    IF parent_code IS NOT NULL AND left(NEW.code, length(parent_code) + 1) <> parent_code || '.' THEN
      RAISE EXCEPTION 'folder code % must sit under its ancestor code %', NEW.code, parent_code USING ERRCODE = 'MZ002';
    END IF;
  END IF;
  IF NEW.parent_id IS NOT NULL AND NEW.access IS NOT NULL THEN
    SELECT access INTO parent_eff FROM filesystem.effective_folder(NEW.parent_id);
    IF filesystem.access_rank(NEW.access) < filesystem.access_rank(parent_eff) THEN
      WITH RECURSIVE up AS (SELECT id, parent_id, access, allow_weaker_children, 0 AS d FROM filesystem.folders WHERE id = NEW.parent_id
        UNION ALL SELECT f.id, f.parent_id, f.access, f.allow_weaker_children, up.d + 1 FROM filesystem.folders f JOIN up ON f.id = up.parent_id WHERE up.d < 32)
      SELECT * INTO setter FROM up WHERE access IS NOT NULL ORDER BY d LIMIT 1;
      IF setter.id IS NULL THEN RETURN NEW; END IF; -- only the implicit default applies
      IF NOT setter.allow_weaker_children THEN
        RAISE EXCEPTION 'access % would widen % set by an ancestor that does not allow weaker children', NEW.access, parent_eff USING ERRCODE = 'MZ001';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER files_code_guard BEFORE INSERT OR UPDATE OF code ON filesystem.files FOR EACH ROW EXECUTE FUNCTION filesystem.files_code_guard();
CREATE TRIGGER folders_guard BEFORE INSERT OR UPDATE OF parent_id, access, code ON filesystem.folders FOR EACH ROW EXECUTE FUNCTION filesystem.folders_guard();

-- A parent's stricter access must not leave an explicitly weaker descendant that is not allowed to be weaker.
CREATE FUNCTION filesystem.folders_subtree_guard() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE bad record;
BEGIN
  WITH RECURSIVE down AS (SELECT id, parent_id, access, 0 AS d FROM filesystem.folders WHERE parent_id = NEW.id
    UNION ALL SELECT f.id, f.parent_id, f.access, down.d + 1 FROM filesystem.folders f JOIN down ON f.parent_id = down.id WHERE down.d < 32)
  SELECT d.id INTO bad FROM down d WHERE d.access IS NOT NULL
    AND filesystem.access_rank(d.access) < filesystem.access_rank((SELECT access FROM filesystem.effective_folder(d.parent_id)))
    AND NOT EXISTS (SELECT 1 FROM filesystem.folders p WHERE p.id = d.parent_id AND p.allow_weaker_children)
    AND NOT coalesce((SELECT allow_weaker_children FROM filesystem.folders s WHERE s.id = (
          WITH RECURSIVE u AS (SELECT id, parent_id, access, 0 AS x FROM filesystem.folders WHERE id = d.parent_id UNION ALL SELECT f.id, f.parent_id, f.access, u.x + 1 FROM filesystem.folders f JOIN u ON f.id = u.parent_id WHERE u.x < 32)
          SELECT id FROM u WHERE access IS NOT NULL ORDER BY x LIMIT 1)), true)
  LIMIT 1;
  IF bad.id IS NOT NULL THEN RAISE EXCEPTION 'folder % is explicitly weaker than its new parent classification', bad.id USING ERRCODE = 'MZ001'; END IF;
  RETURN NULL;
END $$;
CREATE TRIGGER folders_subtree_guard AFTER UPDATE OF parent_id, access, allow_weaker_children ON filesystem.folders FOR EACH ROW EXECUTE FUNCTION filesystem.folders_subtree_guard();

-- Physical placement must agree with effective access at commit: the S3 key prefix of every retained version equals the
-- effective access of its file's folder. A database access change alone therefore cannot silently change visibility; the
-- transition operation relocates the keys and the folder in one transaction.
CREATE FUNCTION filesystem.placement_violations(p_folder uuid)
RETURNS TABLE (file_version_id uuid, key_prefix text, expected_access text) LANGUAGE sql STABLE AS $$
  WITH RECURSIVE down AS (SELECT id FROM filesystem.folders WHERE id = p_folder UNION ALL SELECT f.id FROM filesystem.folders f JOIN down ON f.parent_id = down.id)
  SELECT v.id, split_part(v.s3_key, '/', 1), (SELECT access FROM filesystem.effective_folder(fl.folder_id))
    FROM down d JOIN filesystem.files fl ON fl.folder_id = d.id JOIN filesystem.file_versions v ON v.file_id = fl.id
   WHERE split_part(v.s3_key, '/', 1) <> (SELECT access FROM filesystem.effective_folder(fl.folder_id)) $$;

CREATE FUNCTION filesystem.check_placement_folder() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE bad record;
BEGIN
  SELECT * INTO bad FROM filesystem.placement_violations(NEW.id) LIMIT 1;
  IF bad.file_version_id IS NOT NULL THEN
    RAISE EXCEPTION 'version % is stored under %/ but its folder is now %: relocate the content with the access transition', bad.file_version_id, bad.key_prefix, bad.expected_access USING ERRCODE = 'MZ001';
  END IF;
  RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER folders_placement AFTER UPDATE OF parent_id, access ON filesystem.folders DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION filesystem.check_placement_folder();

CREATE FUNCTION filesystem.check_placement_file() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE bad record;
BEGIN
  SELECT v.id AS vid, split_part(v.s3_key, '/', 1) AS prefix, (SELECT access FROM filesystem.effective_folder(NEW.folder_id)) AS expected INTO bad
    FROM filesystem.file_versions v WHERE v.file_id = NEW.id AND split_part(v.s3_key, '/', 1) <> (SELECT access FROM filesystem.effective_folder(NEW.folder_id)) LIMIT 1;
  IF bad.vid IS NOT NULL THEN
    RAISE EXCEPTION 'version % is stored under %/ but the destination folder requires %: relocate the content first', bad.vid, bad.prefix, bad.expected USING ERRCODE = 'MZ001';
  END IF;
  RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER files_placement AFTER INSERT OR UPDATE OF folder_id ON filesystem.files DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION filesystem.check_placement_file();

CREATE FUNCTION filesystem.check_placement_version() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE expected text;
BEGIN
  SELECT e.access INTO expected FROM filesystem.files f, LATERAL filesystem.effective_folder(f.folder_id) e WHERE f.id = NEW.file_id;
  IF split_part(NEW.s3_key, '/', 1) <> expected THEN
    RAISE EXCEPTION 'version key %/ does not match the effective access % of its folder', split_part(NEW.s3_key, '/', 1), expected USING ERRCODE = 'MZ001';
  END IF;
  RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER versions_placement AFTER INSERT OR UPDATE OF s3_key ON filesystem.file_versions DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION filesystem.check_placement_version();

-- Versions are immutable except pinning and relocation of the key; the revision must be the next number; deletion is guarded.
CREATE FUNCTION filesystem.versions_guard() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.revision <= (SELECT last_revision FROM filesystem.files WHERE id = NEW.file_id) THEN
      RAISE EXCEPTION 'revision % is not newer than the last issued revision for the file', NEW.revision USING ERRCODE = 'MZ002';
    END IF;
    UPDATE filesystem.files SET last_revision = NEW.revision WHERE id = NEW.file_id;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF (NEW.file_id, NEW.revision, NEW.sha256, NEW.size_bytes, NEW.extension, NEW.content_type, NEW.original_filename, NEW.provenance, NEW.created_at, NEW.created_by)
       IS DISTINCT FROM (OLD.file_id, OLD.revision, OLD.sha256, OLD.size_bytes, OLD.extension, OLD.content_type, OLD.original_filename, OLD.provenance, OLD.created_at, OLD.created_by) THEN
      RAISE EXCEPTION 'file versions are immutable (only pinning and key relocation may change)' USING ERRCODE = 'MZ002';
    END IF;
    RETURN NEW;
  END IF;
  IF OLD.pinned THEN RAISE EXCEPTION 'version % is pinned (%) and cannot be deleted', OLD.id, OLD.pin_reason USING ERRCODE = 'MZ002'; END IF;
  IF EXISTS (SELECT 1 FROM filesystem.files WHERE current_version_id = OLD.id) THEN RAISE EXCEPTION 'the current version cannot be deleted' USING ERRCODE = 'MZ002'; END IF;
  RETURN OLD;
END $$;
CREATE TRIGGER versions_guard BEFORE INSERT OR UPDATE OR DELETE ON filesystem.file_versions FOR EACH ROW EXECUTE FUNCTION filesystem.versions_guard();

-- Every file has a current version by commit (the file/version creation cycle is resolved in one transaction).
CREATE FUNCTION filesystem.check_current_version() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  -- read the row as it is at commit (NEW is the state when the trigger was queued); a deleted file needs no current version
  IF EXISTS (SELECT 1 FROM filesystem.files WHERE id = NEW.id AND current_version_id IS NULL) THEN
    RAISE EXCEPTION 'file % has no current version; create the file and its first version in one transaction', NEW.id USING ERRCODE = 'MZ002';
  END IF;
  RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER files_have_current_version AFTER INSERT OR UPDATE ON filesystem.files DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION filesystem.check_current_version();

-- Relation rule: derivation chains never loop (a version cannot be derived, directly or not, from its own descendant).
CREATE FUNCTION filesystem.file_relations_guard() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF EXISTS (WITH RECURSIVE up(id, depth) AS (SELECT NEW.source_version_id, 0 UNION SELECT r.source_version_id, up.depth + 1 FROM filesystem.file_relations r JOIN up ON r.derived_version_id = up.id WHERE up.depth < 64)
             SELECT 1 FROM up WHERE id = NEW.derived_version_id) THEN
    RAISE EXCEPTION 'derivation would create a cycle' USING ERRCODE = 'MZ002';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER file_relations_guard BEFORE INSERT ON filesystem.file_relations FOR EACH ROW EXECUTE FUNCTION filesystem.file_relations_guard();

-- Referenced content: a key is in use while any retained version or open upload references it.
CREATE FUNCTION filesystem.key_in_use(p_key text) RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM filesystem.file_versions WHERE s3_key = p_key) OR EXISTS (SELECT 1 FROM filesystem.uploads WHERE temp_key = p_key AND status IN ('pending', 'uploaded')) $$;
COMMENT ON FUNCTION filesystem.key_in_use(text) IS 'True while any retained version or live upload references the key; cleanup never deletes a key for which this is true.';
