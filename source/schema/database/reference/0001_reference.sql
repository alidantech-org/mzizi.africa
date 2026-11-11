CREATE SCHEMA reference;
COMMENT ON SCHEMA reference IS 'Modern country context, controlled meanings and reviewed reusable definitions.';

CREATE FUNCTION reference.valid_code(p text) RETURNS boolean LANGUAGE sql IMMUTABLE STRICT AS $$
  SELECT p ~ '^[a-z0-9][a-z0-9_]*(\.[a-z0-9][a-z0-9_]*)*$' AND length(p) <= 255 AND cardinality(string_to_array(p,'.')) <= 16
$$;

CREATE TABLE reference.countries (
  id uuid PRIMARY KEY DEFAULT uuidv7(), code text NOT NULL UNIQUE CHECK (reference.valid_code(code)),
  name text NOT NULL CHECK (length(btrim(name)) > 0), iso_alpha2 char(2) UNIQUE,
  recognition_status text NOT NULL CHECK (recognition_status IN ('recognized','disputed','historical_transition')),
  source_file_version_id uuid REFERENCES filesystem.file_versions(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE reference.countries IS 'Modern country context; recognition is a reviewed assertion. Historic polities live in their own domain.';

CREATE TABLE reference.schemes (
  id uuid PRIMARY KEY DEFAULT uuidv7(), code text NOT NULL UNIQUE CHECK (reference.valid_code(code)),
  name text NOT NULL, description text NOT NULL, owner text NOT NULL CHECK (owner IN ('global','country','domain')),
  country_id uuid REFERENCES reference.countries(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((owner='country') = (country_id IS NOT NULL))
);
COMMENT ON TABLE reference.schemes IS 'Described controlled vocabularies. A global scheme has no fictional world jurisdiction.';

CREATE TABLE reference.values (
  id uuid PRIMARY KEY DEFAULT uuidv7(), code text NOT NULL UNIQUE CHECK (reference.valid_code(code)),
  scheme_id uuid NOT NULL REFERENCES reference.schemes(id) ON DELETE RESTRICT,
  label text NOT NULL, description text NOT NULL,
  retired_at timestamptz, superseded_by_id uuid REFERENCES reference.values(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (scheme_id,id), UNIQUE (scheme_id,code), CHECK (superseded_by_id IS DISTINCT FROM id)
);
CREATE INDEX reference_values_scheme ON reference.values(scheme_id,retired_at);
COMMENT ON TABLE reference.values IS 'Stable concept identity; retirement is curation time, not historical validity.';

CREATE TABLE reference.value_labels (
  value_id uuid NOT NULL REFERENCES reference.values(id) ON DELETE RESTRICT,
  language_tag text NOT NULL, label text NOT NULL,
  label_kind text NOT NULL CHECK (label_kind IN ('preferred','alternate')),
  PRIMARY KEY(value_id,language_tag,label,label_kind)
);
CREATE UNIQUE INDEX reference_one_preferred_label ON reference.value_labels(value_id,language_tag) WHERE label_kind='preferred';
COMMENT ON TABLE reference.value_labels IS 'Localized preferred and alternate labels; never a second concept identity.';

CREATE TABLE reference.value_relations (
  from_id uuid NOT NULL REFERENCES reference.values(id) ON DELETE RESTRICT,
  to_id uuid NOT NULL REFERENCES reference.values(id) ON DELETE RESTRICT,
  kind text NOT NULL CHECK (kind IN ('broader','narrower','related','exact_mapping','close_mapping')),
  evidence_file_version_id uuid REFERENCES filesystem.file_versions(id) ON DELETE RESTRICT,
  PRIMARY KEY(from_id,to_id,kind), CHECK (from_id<>to_id),
  CHECK (kind<>'exact_mapping' OR evidence_file_version_id IS NOT NULL)
);
COMMENT ON TABLE reference.value_relations IS 'Meaning relations and mappings, never territorial containment.';

CREATE TABLE reference.value_applicability (
  id uuid PRIMARY KEY DEFAULT uuidv7(), value_id uuid NOT NULL REFERENCES reference.values(id) ON DELETE RESTRICT,
  country_id uuid REFERENCES reference.countries(id) ON DELETE RESTRICT,
  period daterange, status text NOT NULL CHECK (status IN ('approved','disputed')),
  evidence_file_version_id uuid REFERENCES filesystem.file_versions(id) ON DELETE RESTRICT,
  UNIQUE NULLS NOT DISTINCT (value_id,country_id,period)
);
CREATE INDEX reference_value_applicability_period ON reference.value_applicability USING gist(period);
COMMENT ON TABLE reference.value_applicability IS 'Explicit global or country applicability and optional historical period; null country means global.';

CREATE TABLE reference.topics (
  id uuid PRIMARY KEY DEFAULT uuidv7(), code text NOT NULL UNIQUE CHECK (reference.valid_code(code)),
  name text NOT NULL, description text NOT NULL, parent_id uuid REFERENCES reference.topics(id) ON DELETE RESTRICT,
  CHECK (parent_id IS DISTINCT FROM id)
);
COMMENT ON TABLE reference.topics IS 'User exploration topics. Backend capability bindings are separately approved.';

CREATE TABLE reference.patterns (
  id uuid PRIMARY KEY DEFAULT uuidv7(), code text NOT NULL UNIQUE CHECK (reference.valid_code(code)),
  name text NOT NULL, description text NOT NULL,
  owner_account_id uuid NOT NULL REFERENCES auth.accounts(id) ON DELETE RESTRICT
);
COMMENT ON TABLE reference.patterns IS 'Stable identity of a reviewed reusable pattern definition.';

CREATE TABLE reference.pattern_versions (
  id uuid PRIMARY KEY DEFAULT uuidv7(), pattern_id uuid NOT NULL REFERENCES reference.patterns(id) ON DELETE RESTRICT,
  version integer NOT NULL CHECK(version>0), file_version_id uuid NOT NULL REFERENCES filesystem.file_versions(id) ON DELETE RESTRICT,
  schema_version text NOT NULL, capability text NOT NULL, capability_version text NOT NULL,
  input_hash char(64) NOT NULL CHECK (input_hash ~ '^[0-9a-f]{64}$'),
  max_outputs integer NOT NULL CHECK(max_outputs BETWEEN 1 AND 100000),
  reviewed_by uuid REFERENCES auth.accounts(id) ON DELETE RESTRICT,
  reviewed_at timestamptz, activated_at timestamptz, retired_at timestamptz,
  UNIQUE(pattern_id,version),
  CHECK ((reviewed_by IS NULL) = (reviewed_at IS NULL)),
  CHECK (activated_at IS NULL OR (reviewed_at IS NOT NULL AND activated_at>=reviewed_at)),
  CHECK (retired_at IS NULL OR (activated_at IS NOT NULL AND retired_at>=activated_at))
);
COMMENT ON TABLE reference.pattern_versions IS 'Immutable approved definition release bound to exact stored bytes and a registered capability.';

CREATE TABLE reference.pattern_dependencies (
  upstream_version_id uuid NOT NULL REFERENCES reference.pattern_versions(id) ON DELETE RESTRICT,
  downstream_version_id uuid NOT NULL REFERENCES reference.pattern_versions(id) ON DELETE RESTRICT,
  PRIMARY KEY(upstream_version_id,downstream_version_id), CHECK(upstream_version_id<>downstream_version_id)
);
COMMENT ON TABLE reference.pattern_dependencies IS 'Definition dependencies only; run scheduling remains in engine.';
