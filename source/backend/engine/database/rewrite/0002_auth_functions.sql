-- Rewrite migration 0002: registration helpers, integrity triggers, the access check and seeds.

-- ------------------------------------------------------------------ integrity
CREATE FUNCTION auth.institutions_guard() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE cur uuid := NEW.parent_id; depth int := 0;
BEGIN
  WHILE cur IS NOT NULL AND depth < 32 LOOP
    IF cur = NEW.id THEN RAISE EXCEPTION 'institution hierarchy cannot contain a cycle'; END IF;
    SELECT parent_id INTO cur FROM auth.institutions WHERE id = cur;
    depth := depth + 1;
  END LOOP;
  RETURN NEW;
END $$;
CREATE TRIGGER institutions_guard BEFORE INSERT OR UPDATE ON auth.institutions FOR EACH ROW EXECUTE FUNCTION auth.institutions_guard();

CREATE FUNCTION auth.has_column(p_table text, p_column text) RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT to_regclass(p_table) IS NOT NULL AND EXISTS (
    SELECT 1 FROM pg_attribute WHERE attrelid = to_regclass(p_table) AND attname = p_column AND attnum > 0 AND NOT attisdropped) $$;

CREATE FUNCTION auth.assignments_guard() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE found boolean;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF (NEW.account_id, NEW.role_id, NEW.scope_table, NEW.scope_id, NEW.granted_by, NEW.created_at) IS DISTINCT FROM (OLD.account_id, OLD.role_id, OLD.scope_table, OLD.scope_id, OLD.granted_by, OLD.created_at) THEN
      RAISE EXCEPTION 'a grant cannot be edited; revoke it and grant again';
    END IF;
    IF NEW.expires_at IS DISTINCT FROM OLD.expires_at AND (NEW.expires_at IS NULL OR (OLD.expires_at IS NOT NULL AND NEW.expires_at > OLD.expires_at)) THEN
      RAISE EXCEPTION 'a grant cannot be extended; grant again';
    END IF;
    IF OLD.revoked_at IS NOT NULL AND NEW.revoked_at IS DISTINCT FROM OLD.revoked_at THEN RAISE EXCEPTION 'already revoked'; END IF;
    RETURN NEW;
  END IF;
  IF NEW.scope_table IS NOT NULL AND NEW.scope_id IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM auth.scope_targets WHERE table_name = NEW.scope_table) THEN RAISE EXCEPTION '% is not an allowed scope target', NEW.scope_table; END IF;
    EXECUTE format('SELECT EXISTS (SELECT 1 FROM %s WHERE id = $1)', NEW.scope_table::regclass) INTO found USING NEW.scope_id;
    IF NOT found THEN RAISE EXCEPTION 'scope record % does not exist in %', NEW.scope_id, NEW.scope_table; END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER assignments_guard BEFORE INSERT OR UPDATE ON auth.role_assignments FOR EACH ROW EXECUTE FUNCTION auth.assignments_guard();

CREATE FUNCTION auth.forbid_delete() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'rows in % are never deleted (close or revoke instead)', TG_TABLE_NAME; END $$;
CREATE TRIGGER accounts_no_delete BEFORE DELETE ON auth.accounts FOR EACH ROW EXECUTE FUNCTION auth.forbid_delete();
CREATE TRIGGER assignments_no_delete BEFORE DELETE ON auth.role_assignments FOR EACH ROW EXECUTE FUNCTION auth.forbid_delete();

-- --------------------------------------------------------------- registration
CREATE FUNCTION auth.register_scope_target(p_table text, p_parent_column text DEFAULT NULL) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  IF NOT auth.has_column(p_table, 'id') THEN RAISE EXCEPTION 'table % does not exist or has no id column', p_table; END IF;
  IF p_parent_column IS NOT NULL AND NOT auth.has_column(p_table, p_parent_column) THEN RAISE EXCEPTION 'column % not found in %', p_parent_column, p_table; END IF;
  INSERT INTO auth.scope_targets VALUES (p_table, p_parent_column);
END $$;

CREATE FUNCTION auth.register_governed_table(p_table text, p_namespace text, p_link_table text, p_link_column text) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  IF NOT auth.has_column(p_table, 'id') THEN RAISE EXCEPTION 'table % does not exist or has no id column', p_table; END IF;
  IF NOT auth.has_column(p_table, p_link_column) THEN RAISE EXCEPTION 'column % not found in %', p_link_column, p_table; END IF;
  IF NOT EXISTS (SELECT 1 FROM auth.permissions WHERE namespace = p_namespace) THEN RAISE EXCEPTION 'namespace % is not registered', p_namespace; END IF;
  INSERT INTO auth.governed_tables VALUES (p_table, p_namespace, p_link_table, p_link_column);
END $$;

-- Creates the six permissions of a namespace and gives them to the admin role.
CREATE FUNCTION auth.register_namespace(p_namespace text) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO auth.permissions (namespace, action) SELECT p_namespace, a FROM unnest(ARRAY['read', 'edit', 'review', 'publish', 'export', 'delete']) a ON CONFLICT DO NOTHING;
  INSERT INTO auth.role_permissions SELECT r.id, p.namespace, p.action FROM auth.roles r, auth.permissions p WHERE r.code = 'admin' AND p.namespace = p_namespace ON CONFLICT DO NOTHING;
END $$;

-- p_permissions entries are 'namespace.action' or 'namespace.*'.
CREATE FUNCTION auth.create_role(p_code text, p_name text, p_permissions text[]) RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE v_id uuid; p text;
BEGIN
  INSERT INTO auth.roles (code, name) VALUES (p_code, p_name) RETURNING id INTO v_id;
  FOREACH p IN ARRAY p_permissions LOOP
    INSERT INTO auth.role_permissions SELECT v_id, namespace, action FROM auth.permissions
      WHERE namespace = split_part(p, '.', 1) AND (split_part(p, '.', 2) = '*' OR action = split_part(p, '.', 2));
    IF NOT FOUND THEN RAISE EXCEPTION 'unknown permission %', p; END IF;
  END LOOP;
  RETURN v_id;
END $$;

-- ------------------------------------------------------------------ scope walk
-- The record and its ancestors in a scope target table.
CREATE FUNCTION auth.ancestors(p_table text, p_id uuid) RETURNS SETOF uuid LANGUAGE plpgsql STABLE AS $$
DECLARE cur uuid := p_id; col text; depth int := 0;
BEGIN
  SELECT parent_column INTO col FROM auth.scope_targets WHERE table_name = p_table;
  WHILE cur IS NOT NULL AND depth < 32 LOOP
    RETURN NEXT cur;
    EXIT WHEN col IS NULL;
    EXECUTE format('SELECT %I FROM %s WHERE id = $1', col, p_table::regclass) INTO cur USING cur;
    depth := depth + 1;
  END LOOP;
END $$;

-- The record and everything below it.
CREATE FUNCTION auth.descendants(p_table text, p_id uuid) RETURNS SETOF uuid LANGUAGE plpgsql STABLE AS $$
DECLARE col text;
BEGIN
  SELECT parent_column INTO col FROM auth.scope_targets WHERE table_name = p_table;
  IF col IS NULL THEN RETURN NEXT p_id; RETURN; END IF;
  RETURN QUERY EXECUTE format('WITH RECURSIVE d(id, depth) AS (SELECT $1, 0 UNION ALL SELECT t.id, d.depth + 1 FROM %s t JOIN d ON t.%I = d.id WHERE d.depth < 32) SELECT id FROM d', p_table::regclass, col) USING p_id;
END $$;

-- ------------------------------------------------------------------- the check
CREATE FUNCTION auth.live_grants(p_account uuid, p_namespace text, p_action text)
RETURNS TABLE (assignment_id uuid, scope_table text, scope_id uuid) LANGUAGE sql STABLE AS $$
  SELECT ra.id, ra.scope_table, ra.scope_id
    FROM auth.role_assignments ra
    JOIN auth.accounts a ON a.id = ra.account_id AND a.status = 'active'
    JOIN auth.role_permissions rp ON rp.role_id = ra.role_id AND rp.namespace = p_namespace AND rp.action = p_action
   WHERE ra.account_id = p_account AND ra.revoked_at IS NULL AND (ra.expires_at IS NULL OR ra.expires_at > now()) $$;

-- Platform-wide access to a permission that is not about a particular record (e.g. auth.edit, pipeline.read).
CREATE FUNCTION auth.can_platform(p_account uuid, p_permission text) RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM auth.live_grants(p_account, split_part(p_permission, '.', 1), split_part(p_permission, '.', 2)) WHERE scope_table IS NULL) $$;

-- May the account use the permission on records of a governed table that belong to link record p_link?
CREATE FUNCTION auth.can_link(p_account uuid, p_permission text, p_table text, p_link uuid) RETURNS jsonb LANGUAGE plpgsql STABLE AS $$
DECLARE v_ns text := split_part(p_permission, '.', 1); v_act text := split_part(p_permission, '.', 2); g auth.governed_tables%ROWTYPE; v_grant uuid; v_any boolean;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.accounts WHERE id = p_account AND status = 'active') THEN RETURN jsonb_build_object('allowed', false, 'reason', 'account_not_active'); END IF;
  SELECT * INTO g FROM auth.governed_tables WHERE table_name = p_table;
  IF NOT FOUND THEN RETURN jsonb_build_object('allowed', false, 'reason', 'table_not_governed'); END IF;
  IF g.namespace <> v_ns THEN RETURN jsonb_build_object('allowed', false, 'reason', 'namespace_mismatch'); END IF;
  SELECT true INTO v_any FROM auth.live_grants(p_account, v_ns, v_act) LIMIT 1;
  IF v_any IS NULL THEN RETURN jsonb_build_object('allowed', false, 'reason', 'no_grant'); END IF;
  SELECT assignment_id INTO v_grant FROM auth.live_grants(p_account, v_ns, v_act) WHERE scope_table IS NULL LIMIT 1;
  IF v_grant IS NULL AND p_link IS NOT NULL THEN
    SELECT lg.assignment_id INTO v_grant FROM auth.live_grants(p_account, v_ns, v_act) lg
     WHERE lg.scope_table = g.link_table AND lg.scope_id IN (SELECT auth.ancestors(g.link_table, p_link)) LIMIT 1;
  END IF;
  IF v_grant IS NULL THEN RETURN jsonb_build_object('allowed', false, 'reason', 'out_of_scope'); END IF;
  RETURN jsonb_build_object('allowed', true, 'reason', 'granted', 'assignment_id', v_grant);
END $$;
COMMENT ON FUNCTION auth.can_link IS 'Core check: active account + live grant whose role holds the permission + (platform-wide, or the grant''s scope record is the owning link record or one of its ancestors). Default deny.';

-- May the account use the permission on an existing record?
CREATE FUNCTION auth.can(p_account uuid, p_permission text, p_table text, p_record uuid) RETURNS jsonb LANGUAGE plpgsql STABLE AS $$
DECLARE g auth.governed_tables%ROWTYPE; v_link uuid; v_found boolean;
BEGIN
  SELECT * INTO g FROM auth.governed_tables WHERE table_name = p_table;
  IF NOT FOUND THEN RETURN jsonb_build_object('allowed', false, 'reason', 'table_not_governed'); END IF;
  EXECUTE format('SELECT true, %I FROM %s WHERE id = $1', g.link_column, p_table::regclass) INTO v_found, v_link USING p_record;
  IF v_found IS NULL THEN RETURN jsonb_build_object('allowed', false, 'reason', 'record_not_found'); END IF;
  RETURN auth.can_link(p_account, p_permission, p_table, v_link);
END $$;

-- Updates that may change the owner: both the existing and the proposed owner must allow it.
CREATE FUNCTION auth.can_change(p_account uuid, p_permission text, p_table text, p_record uuid, p_new_link uuid) RETURNS jsonb LANGUAGE plpgsql STABLE AS $$
DECLARE v jsonb;
BEGIN
  v := auth.can(p_account, p_permission, p_table, p_record);
  IF NOT (v ->> 'allowed')::boolean THEN RETURN v || jsonb_build_object('failed_on', 'existing_owner'); END IF;
  v := auth.can_link(p_account, p_permission, p_table, p_new_link);
  IF NOT (v ->> 'allowed')::boolean THEN RETURN v || jsonb_build_object('failed_on', 'proposed_owner'); END IF;
  RETURN v;
END $$;

-- Which link records (with descendants) may the account use the permission on? Join to filter lists before pagination.
CREATE FUNCTION auth.allowed_links(p_account uuid, p_permission text, p_table text) RETURNS TABLE (all_records boolean, link_id uuid) LANGUAGE plpgsql STABLE AS $$
DECLARE v_ns text := split_part(p_permission, '.', 1); v_act text := split_part(p_permission, '.', 2); g auth.governed_tables%ROWTYPE;
BEGIN
  SELECT * INTO g FROM auth.governed_tables WHERE table_name = p_table;
  IF NOT FOUND OR g.namespace <> v_ns THEN RETURN; END IF;
  IF EXISTS (SELECT 1 FROM auth.live_grants(p_account, v_ns, v_act) WHERE scope_table IS NULL) THEN RETURN QUERY SELECT true, NULL::uuid; RETURN; END IF;
  RETURN QUERY SELECT false, d FROM auth.live_grants(p_account, v_ns, v_act) lg, LATERAL auth.descendants(lg.scope_table, lg.scope_id) d WHERE lg.scope_table = g.link_table;
END $$;

-- ------------------------------------------------------------ identity and grants
CREATE FUNCTION auth.resolve_identity(p_issuer text, p_subject text) RETURNS TABLE (account_id uuid, outcome text) LANGUAGE sql STABLE AS $$
  SELECT a.id, CASE WHEN a.status = 'active' THEN 'ok' ELSE 'account_not_active' END
    FROM auth.identities i JOIN auth.accounts a ON a.id = i.account_id WHERE i.issuer = p_issuer AND i.subject = p_subject
  UNION ALL SELECT NULL::uuid, 'unknown_identity' WHERE NOT EXISTS (SELECT 1 FROM auth.identities WHERE issuer = p_issuer AND subject = p_subject) $$;

-- Only accounts with platform-wide auth.edit grant or revoke access.
CREATE FUNCTION auth.grant_role(p_grantor uuid, p_account uuid, p_role_code text, p_scope_table text DEFAULT NULL, p_scope_id uuid DEFAULT NULL, p_expires_at timestamptz DEFAULT NULL) RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE v_id uuid;
BEGIN
  IF NOT auth.can_platform(p_grantor, 'auth.edit') THEN RAISE EXCEPTION 'account % may not grant access', p_grantor; END IF;
  INSERT INTO auth.role_assignments (account_id, role_id, scope_table, scope_id, expires_at, granted_by)
  SELECT p_account, id, p_scope_table, p_scope_id, p_expires_at, p_grantor FROM auth.roles WHERE code = p_role_code RETURNING id INTO v_id;
  IF v_id IS NULL THEN RAISE EXCEPTION 'unknown role %', p_role_code; END IF;
  RETURN v_id;
END $$;

CREATE FUNCTION auth.revoke_grant(p_actor uuid, p_assignment uuid) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  IF NOT auth.can_platform(p_actor, 'auth.edit') THEN RAISE EXCEPTION 'account % may not revoke access', p_actor; END IF;
  UPDATE auth.role_assignments SET revoked_at = now() WHERE id = p_assignment AND revoked_at IS NULL;
END $$;

-- First administrator (run by the database management engine, not by the application).
CREATE FUNCTION auth.bootstrap_admin(p_issuer text, p_subject text, p_display_name text) RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE v_account uuid;
BEGIN
  INSERT INTO auth.accounts (display_name) VALUES (p_display_name) RETURNING id INTO v_account;
  INSERT INTO auth.identities (account_id, issuer, subject) VALUES (v_account, p_issuer, p_subject);
  INSERT INTO auth.role_assignments (account_id, role_id, granted_by) SELECT v_account, id, v_account FROM auth.roles WHERE code = 'admin';
  RETURN v_account;
END $$;
REVOKE ALL ON FUNCTION auth.bootstrap_admin(text, text, text) FROM PUBLIC;

-- ---------------------------------------------------------------------- seeds
INSERT INTO auth.roles (code, name) VALUES ('admin', 'Platform administrator');
SELECT auth.register_namespace(n) FROM unnest(ARRAY['auth', 'pipeline', 'audit', 'electoral', 'governance', 'finance', 'geography', 'legal', 'person', 'source']) n;
SELECT auth.create_role('reader', 'Reader', ARRAY['electoral.read', 'governance.read', 'finance.read', 'geography.read', 'legal.read', 'person.read', 'source.read']);
SELECT auth.create_role('contributor', 'Contributor', ARRAY['electoral.read', 'governance.read', 'finance.read', 'geography.read', 'legal.read', 'person.read', 'source.read', 'audit.edit']);
SELECT auth.create_role('reviewer', 'Platform reviewer', ARRAY['electoral.read', 'governance.read', 'finance.read', 'geography.read', 'legal.read', 'person.read', 'source.read',
  'audit.edit', 'audit.review', 'pipeline.read', 'pipeline.edit', 'pipeline.review', 'pipeline.publish']);
SELECT auth.register_scope_target('auth.institutions', 'parent_id');
