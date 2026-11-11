-- Readable path keys (decision DEC-FILESYSTEM-READABLE-KEYS, 2026-11-11). Replaces the content-addressed key layout of 0001.
-- The key of a file's current version is <effective access>/<folder path>/<file name>; a superseded retained version lives at
-- <effective access>/<folder path>/_versions/<file name>/r<NNNN>/<file name>. A key belongs to exactly one version and must
-- equal the key computed from the registry path at commit, so the bucket mirrors filesystem.paths and nothing is overwritten.

-- ------------------------------------------------------------------------------------------ reserved names
ALTER TABLE filesystem.folders ADD CONSTRAINT folders_reserved_names
  CHECK (name <> '_versions' AND (parent_id IS NOT NULL OR name NOT IN ('raw', 'tmp', 'content')));
ALTER TABLE filesystem.files ADD CONSTRAINT files_reserved_names CHECK (name <> '_versions');
COMMENT ON CONSTRAINT folders_reserved_names ON filesystem.folders IS '_versions holds superseded revisions. Root folders raw, tmp and content would collide with the protected public/raw archive, private/tmp uploads and the retired content/ layout.';

CREATE FUNCTION filesystem.sibling_names_guard() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_TABLE_NAME = 'folders' THEN
    IF NEW.parent_id IS NOT NULL AND EXISTS (SELECT 1 FROM filesystem.files WHERE folder_id = NEW.parent_id AND name = NEW.name) THEN
      RAISE EXCEPTION 'a file named % already exists in the parent folder; a folder and a file cannot share a name', NEW.name USING ERRCODE = 'MZ002';
    END IF;
  ELSIF EXISTS (SELECT 1 FROM filesystem.folders WHERE parent_id = NEW.folder_id AND name = NEW.name) THEN
    RAISE EXCEPTION 'a folder named % already exists in the folder; a folder and a file cannot share a name', NEW.name USING ERRCODE = 'MZ002';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER folders_sibling_names BEFORE INSERT OR UPDATE OF name, parent_id ON filesystem.folders FOR EACH ROW EXECUTE FUNCTION filesystem.sibling_names_guard();
CREATE TRIGGER files_sibling_names BEFORE INSERT OR UPDATE OF name, folder_id ON filesystem.files FOR EACH ROW EXECUTE FUNCTION filesystem.sibling_names_guard();

-- ------------------------------------------------------------------------------------------- computed keys
CREATE FUNCTION filesystem.version_key(p_version uuid) RETURNS text LANGUAGE sql STABLE AS $$
  SELECT e.access || filesystem.folder_path(f.folder_id) || '/'
         || CASE WHEN f.current_version_id = v.id THEN f.name
                 ELSE '_versions/' || f.name || '/r' || lpad(v.revision::text, greatest(4, length(v.revision::text)), '0') || '/' || f.name END
    FROM filesystem.file_versions v JOIN filesystem.files f ON f.id = v.file_id, LATERAL filesystem.effective_folder(f.folder_id) e
   WHERE v.id = p_version $$;
COMMENT ON FUNCTION filesystem.version_key(uuid) IS 'The only key a retained version may have: the readable path for the current version, the version folder for a superseded one. Mirrored by mzizi_filesystem.keys.';

CREATE FUNCTION filesystem.key_violations(p_folder uuid)
RETURNS TABLE (file_version_id uuid, s3_key text, expected_key text) LANGUAGE sql STABLE AS $$
  WITH RECURSIVE down AS (SELECT id FROM filesystem.folders WHERE id = p_folder UNION ALL SELECT f.id FROM filesystem.folders f JOIN down ON f.parent_id = down.id)
  SELECT v.id, v.s3_key, filesystem.version_key(v.id)
    FROM down d JOIN filesystem.files fl ON fl.folder_id = d.id JOIN filesystem.file_versions v ON v.file_id = fl.id
   WHERE v.s3_key <> filesystem.version_key(v.id) $$;
COMMENT ON FUNCTION filesystem.key_violations(uuid) IS 'Versions under a folder whose stored key differs from the computed key; the relocation routine copies each to expected_key.';

-- One version per key: two files, or two revisions, can never point at (and so overwrite) the same object.
DROP INDEX filesystem.file_versions_key;
CREATE UNIQUE INDEX file_versions_key ON filesystem.file_versions (s3_key);

-- ------------------------------------------------------------------------- commit-time key equals path check
DROP TRIGGER folders_placement ON filesystem.folders;
DROP TRIGGER files_placement ON filesystem.files;
DROP TRIGGER versions_placement ON filesystem.file_versions;
DROP FUNCTION filesystem.check_placement_folder();
DROP FUNCTION filesystem.check_placement_file();
DROP FUNCTION filesystem.check_placement_version();
DROP FUNCTION filesystem.placement_violations(uuid);

CREATE FUNCTION filesystem.check_keys() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE bad record;
BEGIN
  IF TG_TABLE_NAME = 'folders' THEN
    SELECT * INTO bad FROM filesystem.key_violations(NEW.id) LIMIT 1;
  ELSIF TG_TABLE_NAME = 'files' THEN
    SELECT v.id AS file_version_id, v.s3_key, filesystem.version_key(v.id) AS expected_key INTO bad
      FROM filesystem.file_versions v WHERE v.file_id = NEW.id AND v.s3_key <> filesystem.version_key(v.id) LIMIT 1;
  ELSE
    SELECT v.id AS file_version_id, v.s3_key, filesystem.version_key(v.id) AS expected_key INTO bad
      FROM filesystem.file_versions v WHERE v.id = NEW.id AND v.s3_key <> filesystem.version_key(v.id);
  END IF;
  IF bad.file_version_id IS NOT NULL THEN
    RAISE EXCEPTION 'version % is stored at % but its registry path requires %: relocate the object in the same transaction', bad.file_version_id, bad.s3_key, bad.expected_key USING ERRCODE = 'MZ001';
  END IF;
  RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER folders_keys AFTER UPDATE OF parent_id, access, name ON filesystem.folders DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION filesystem.check_keys();
CREATE CONSTRAINT TRIGGER files_keys AFTER INSERT OR UPDATE OF folder_id, name, current_version_id ON filesystem.files DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION filesystem.check_keys();
CREATE CONSTRAINT TRIGGER versions_keys AFTER INSERT OR UPDATE OF s3_key ON filesystem.file_versions DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION filesystem.check_keys();

COMMENT ON TABLE filesystem.files IS 'Stable logical file identity and placement. Content lives in file_versions. The path is the object key: moving or renaming a file relocates its objects in the same transaction.';
COMMENT ON TABLE filesystem.file_versions IS 'Exact content revisions. Each version owns exactly one object key, computed from the registry path (filesystem.version_key). Equal bytes at two paths are two objects; duplicates are found by sha256.';
COMMENT ON COLUMN filesystem.file_versions.s3_key IS 'Object key in the configured bucket: <access>/<folder path>/<name> for the current version, <access>/<folder path>/_versions/<name>/r<NNNN>/<name> for a superseded one. Unique. No bucket, region, endpoint, credential or presigned URL is stored.';
COMMENT ON COLUMN filesystem.files.retention IS 'preserve_history: changed bytes move the superseded version to the version folder. replace_current: changed bytes replace the readable key; unpinned superseded versions are dropped, pinned or relation-referenced ones are preserved in the version folder.';
