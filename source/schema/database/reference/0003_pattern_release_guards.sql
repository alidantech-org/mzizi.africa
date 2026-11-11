-- A reviewed pattern release must refer to retained, pinned bytes. Drafts may be prepared before approval.
CREATE FUNCTION reference.guard_pattern_release() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.reviewed_at IS NOT NULL OR NEW.activated_at IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM filesystem.file_versions v
      WHERE v.id = NEW.file_version_id AND v.pinned
    ) THEN
      RAISE EXCEPTION 'reviewed pattern release requires pinned artifact bytes';
    END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER pattern_release_guard BEFORE INSERT OR UPDATE ON reference.pattern_versions
FOR EACH ROW EXECUTE FUNCTION reference.guard_pattern_release();

-- A pinned definition cannot become unpinned while a reviewed release cites it.
CREATE FUNCTION reference.protect_pattern_artifact() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.pinned AND NOT NEW.pinned AND EXISTS (
    SELECT 1 FROM reference.pattern_versions p
    WHERE p.file_version_id = OLD.id AND p.reviewed_at IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'reviewed pattern release still references this pinned artifact';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER protect_pattern_artifact BEFORE UPDATE OF pinned ON filesystem.file_versions
FOR EACH ROW EXECUTE FUNCTION reference.protect_pattern_artifact();

COMMENT ON FUNCTION reference.guard_pattern_release() IS 'Review and activation require exact pinned filesystem bytes; input_hash separately identifies the versioned input contract.';
COMMENT ON FUNCTION reference.protect_pattern_artifact() IS 'Retain the exact artifact referenced by reviewed pattern releases.';
