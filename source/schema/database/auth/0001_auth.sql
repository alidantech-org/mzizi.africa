-- Rewrite migration 0001: auth, small on purpose (9 tables). See .docs/improvements/schema-redesign/auth.md.
-- accounts/identities: who signs in. permissions/roles/role_permissions: named access. institutions: who owns data.
-- scope_targets/governed_tables: which tables a grant may point at and how records link to them.
-- role_assignments: an account holds a role, platform-wide or scoped to one record (and its children) of a scope target.

CREATE SCHEMA auth;
COMMENT ON SCHEMA auth IS 'Who may do what, where. Authentication is OIDC; this schema maps a login to an account and decides access.';

CREATE TABLE auth.accounts (
  id           uuid PRIMARY KEY DEFAULT uuidv7(),
  display_name text NOT NULL CHECK (length(btrim(display_name)) > 0),
  status       text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'closed')),
  created_at   timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE auth.accounts IS 'An actor that can use Mzizi. Not a person record. Closed instead of deleted so references stay valid.';
COMMENT ON COLUMN auth.accounts.status IS 'Only active accounts are authorized; suspended is temporary, closed is permanent.';

CREATE TABLE auth.identities (
  id         uuid PRIMARY KEY DEFAULT uuidv7(),
  account_id uuid NOT NULL REFERENCES auth.accounts (id),
  issuer     text NOT NULL CHECK (length(issuer) > 0),
  subject    text NOT NULL CHECK (length(subject) BETWEEN 1 AND 255),
  UNIQUE (issuer, subject)
);
CREATE INDEX identities_account ON auth.identities (account_id);
COMMENT ON TABLE auth.identities IS 'OIDC login (issuer + subject) of an account. The subject is an opaque string, never assumed to be a UUID.';

CREATE TABLE auth.permissions (
  namespace text NOT NULL CHECK (namespace ~ '^[a-z][a-z_]*$'),
  action    text NOT NULL CHECK (action IN ('read', 'edit', 'review', 'publish', 'export', 'delete')),
  PRIMARY KEY (namespace, action)
);
COMMENT ON TABLE auth.permissions IS 'Named access: namespace.action, e.g. electoral.edit. The namespace matches a data schema; actions are fixed. Created by auth.register_namespace.';

CREATE TABLE auth.roles (
  id   uuid PRIMARY KEY DEFAULT uuidv7(),
  code text NOT NULL UNIQUE CHECK (code ~ '^[a-z0-9][a-z0-9_]*(\.[a-z0-9][a-z0-9_]*)*$' AND length(code) <= 255 AND cardinality(string_to_array(code, '.')) <= 16),
  name text NOT NULL
);
COMMENT ON TABLE auth.roles IS 'A named bundle of permissions. Where it applies is decided by each assignment.';

CREATE TABLE auth.role_permissions (
  role_id   uuid NOT NULL REFERENCES auth.roles (id),
  namespace text NOT NULL,
  action    text NOT NULL,
  PRIMARY KEY (role_id, namespace, action),
  FOREIGN KEY (namespace, action) REFERENCES auth.permissions (namespace, action)
);

CREATE TABLE auth.institutions (
  id           uuid PRIMARY KEY DEFAULT uuidv7(),
  code         text NOT NULL UNIQUE CHECK (code ~ '^[a-z0-9][a-z0-9_]*(\.[a-z0-9][a-z0-9_]*)*$' AND length(code) <= 255 AND cardinality(string_to_array(code, '.')) <= 16),
  name         text NOT NULL,
  parent_id    uuid REFERENCES auth.institutions (id),
  country_code char(2) NOT NULL CHECK (country_code ~ '^[A-Z]{2}$'),
  CHECK (parent_id IS NULL OR parent_id <> id)
);
COMMENT ON TABLE auth.institutions IS 'Institutions that own data (IEBC, a county government and its departments). A scope target: a grant on an institution covers its departments.';
COMMENT ON COLUMN auth.institutions.parent_id IS 'Parent institution (a department under a county). Cycles are rejected by trigger.';

CREATE TABLE auth.scope_targets (
  table_name    text PRIMARY KEY CHECK (table_name ~ '^[a-z_][a-z0-9_]*\.[a-z_][a-z0-9_]*$'),
  parent_column text
);
COMMENT ON TABLE auth.scope_targets IS 'Allow-list of tables a grant may point at (schema.table with a uuid id). parent_column, when set, is the self-reference that leads to children: a grant on a record covers everything below it.';

CREATE TABLE auth.governed_tables (
  table_name text PRIMARY KEY CHECK (table_name ~ '^[a-z_][a-z0-9_]*\.[a-z_][a-z0-9_]*$'),
  namespace  text NOT NULL,
  link_table text NOT NULL REFERENCES auth.scope_targets (table_name),
  link_column text NOT NULL
);
COMMENT ON TABLE auth.governed_tables IS 'Data tables whose records are access-controlled. Each has exactly one link: link_column holds the id of a record in link_table (an institution, a jurisdiction, a geo unit) that owns it. Grants match only through that link, so geography never grants ownership of institution-owned data.';

CREATE TABLE auth.role_assignments (
  id          uuid PRIMARY KEY DEFAULT uuidv7(),
  account_id  uuid NOT NULL REFERENCES auth.accounts (id),
  role_id     uuid NOT NULL REFERENCES auth.roles (id),
  scope_table text REFERENCES auth.scope_targets (table_name),
  scope_id    uuid,
  expires_at  timestamptz,
  granted_by  uuid NOT NULL REFERENCES auth.accounts (id),
  revoked_at  timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT scope_both_or_neither CHECK ((scope_table IS NULL) = (scope_id IS NULL))
);
CREATE INDEX role_assignments_account ON auth.role_assignments (account_id) WHERE revoked_at IS NULL;
COMMENT ON TABLE auth.role_assignments IS 'An account holds a role. No scope: platform-wide. With scope: only for the scope record and everything below it. Revoked rows stay as history.';
COMMENT ON COLUMN auth.role_assignments.scope_id IS 'Id of a row in scope_table. No foreign key is possible for a generic pointer, so a trigger checks it exists at insert time.';
COMMENT ON COLUMN auth.role_assignments.expires_at IS 'Optional end of the grant.';
COMMENT ON COLUMN auth.role_assignments.revoked_at IS 'Set when the grant is withdrawn.';
