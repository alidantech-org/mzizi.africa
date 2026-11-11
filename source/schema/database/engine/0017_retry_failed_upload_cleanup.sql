-- Abandoned sessions with incomplete object cleanup must be immediately retryable.
-- Failed sessions retain a one-day grace period before object cleanup.
CREATE OR REPLACE FUNCTION filesystem.expired_uploads(p_limit integer)
RETURNS TABLE(id uuid, temp_key text, multipart_id text, referenced boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog, filesystem AS $$
  SELECT u.id, u.temp_key, u.multipart_id,
    EXISTS (SELECT 1 FROM filesystem.file_versions v WHERE v.s3_key = u.temp_key)
  FROM filesystem.uploads u
  WHERE (u.status IN ('pending','uploaded') AND (u.lease_expires_at < now() OR u.expires_at < now()))
     OR (u.status='abandoned' AND u.cleanup_completed_at IS NULL)
     OR (u.status='failed' AND u.cleanup_completed_at IS NULL AND u.created_at < now() - interval '1 day')
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
       OR (u.status='abandoned' AND u.cleanup_completed_at IS NULL)
       OR (u.status='failed' AND u.cleanup_completed_at IS NULL AND u.created_at < now() - interval '1 day')
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
