-- Bounded upload cleanup is exposed as named functions so the runtime role never
-- receives broad UPDATE or DELETE privileges on upload metadata.
ALTER TABLE filesystem.uploads ADD COLUMN cleanup_completed_at timestamptz;

CREATE OR REPLACE FUNCTION filesystem.expired_uploads(p_limit integer)
RETURNS TABLE(id uuid, temp_key text, multipart_id text, referenced boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog, filesystem AS $$
  SELECT u.id, u.temp_key, u.multipart_id,
    EXISTS (SELECT 1 FROM filesystem.file_versions v WHERE v.s3_key = u.temp_key)
  FROM filesystem.uploads u
  WHERE (u.status IN ('pending','uploaded') AND (u.lease_expires_at < now() OR u.expires_at < now()))
     OR (u.status IN ('abandoned','failed') AND u.cleanup_completed_at IS NULL AND u.created_at < now() - interval '1 day')
  ORDER BY u.expires_at LIMIT p_limit
$$;

CREATE OR REPLACE FUNCTION filesystem.abandon_expired_uploads(p_limit integer)
RETURNS TABLE(id uuid, temp_key text, multipart_id text, referenced boolean)
LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = pg_catalog, filesystem AS $$
BEGIN
  RETURN QUERY
  WITH selected AS (
    SELECT u.id FROM filesystem.uploads u
    WHERE (u.status IN ('pending','uploaded') AND (u.lease_expires_at < now() OR u.expires_at < now()))
       OR (u.status IN ('abandoned','failed') AND u.cleanup_completed_at IS NULL AND u.created_at < now() - interval '1 day')
    ORDER BY u.expires_at FOR UPDATE SKIP LOCKED LIMIT p_limit
  ), abandoned AS (
    UPDATE filesystem.uploads u SET status=CASE WHEN u.status IN ('pending','uploaded') THEN 'abandoned' ELSE u.status END,
      error=CASE WHEN u.status IN ('pending','uploaded') THEN 'lease and/or expiry lapsed' ELSE u.error END
    FROM selected s WHERE u.id=s.id RETURNING u.id,u.temp_key,u.multipart_id
  )
  SELECT a.id,a.temp_key,a.multipart_id,
    EXISTS (SELECT 1 FROM filesystem.file_versions v WHERE v.s3_key=a.temp_key)
  FROM abandoned a;
END $$;

CREATE OR REPLACE FUNCTION filesystem.trim_upload_sessions(p_older_than_days integer, p_limit integer)
RETURNS integer
LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = pg_catalog, filesystem AS $$
DECLARE removed integer;
BEGIN
  WITH selected AS (
    SELECT id FROM filesystem.uploads
    WHERE (status='completed' OR (status IN ('failed','abandoned') AND cleanup_completed_at IS NOT NULL))
      AND created_at < now() - make_interval(days => p_older_than_days)
    ORDER BY created_at LIMIT p_limit
  )
  DELETE FROM filesystem.uploads u USING selected s WHERE u.id=s.id;
  GET DIAGNOSTICS removed = ROW_COUNT;
  RETURN removed;
END $$;

CREATE OR REPLACE FUNCTION filesystem.mark_uploads_cleaned(p_ids uuid[])
RETURNS integer
LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = pg_catalog, filesystem AS $$
DECLARE updated integer;
BEGIN
  UPDATE filesystem.uploads SET cleanup_completed_at=now()
  WHERE id=ANY(p_ids) AND status IN ('failed','abandoned') AND cleanup_completed_at IS NULL;
  GET DIAGNOSTICS updated = ROW_COUNT;
  RETURN updated;
END $$;

REVOKE ALL ON FUNCTION filesystem.expired_uploads(integer) FROM PUBLIC, api_reader, database_runtime;
REVOKE ALL ON FUNCTION filesystem.abandon_expired_uploads(integer) FROM PUBLIC, api_reader, database_runtime;
REVOKE ALL ON FUNCTION filesystem.trim_upload_sessions(integer,integer) FROM PUBLIC, api_reader, database_runtime;
REVOKE ALL ON FUNCTION filesystem.mark_uploads_cleaned(uuid[]) FROM PUBLIC, api_reader, database_runtime;
GRANT EXECUTE ON FUNCTION filesystem.expired_uploads(integer) TO mzizi_database_runtime;
GRANT EXECUTE ON FUNCTION filesystem.abandon_expired_uploads(integer) TO mzizi_database_runtime;
GRANT EXECUTE ON FUNCTION filesystem.trim_upload_sessions(integer,integer) TO mzizi_database_runtime;
GRANT EXECUTE ON FUNCTION filesystem.mark_uploads_cleaned(uuid[]) TO mzizi_database_runtime;
