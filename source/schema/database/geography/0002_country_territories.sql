CREATE TABLE geography.country_territories (
  id uuid PRIMARY KEY DEFAULT uuidv7(),
  country_id uuid NOT NULL REFERENCES reference.countries(id) ON DELETE RESTRICT,
  unit_id uuid NOT NULL REFERENCES geography.units(id) ON DELETE RESTRICT,
  period daterange,
  relation_kind text NOT NULL CHECK (relation_kind IN ('core','claimed','administered')),
  evidence_file_version_id uuid NOT NULL REFERENCES filesystem.file_versions(id) ON DELETE RESTRICT,
  observed_at timestamptz NOT NULL DEFAULT now(),
  CHECK (period IS NULL OR NOT isempty(period)),
  UNIQUE NULLS NOT DISTINCT (country_id,unit_id,period,relation_kind)
);
CREATE INDEX country_territories_asof ON geography.country_territories USING gist(period);
COMMENT ON TABLE geography.country_territories IS 'Sourced dated link between a modern country and geographic area. A country can have multiple territorial assertions; no ownership is inferred from code.';

CREATE TABLE geography.unit_changes (
  id uuid PRIMARY KEY DEFAULT uuidv7(),
  predecessor_id uuid NOT NULL REFERENCES geography.units(id) ON DELETE RESTRICT,
  successor_id uuid NOT NULL REFERENCES geography.units(id) ON DELETE RESTRICT,
  kind text NOT NULL CHECK (kind IN ('renamed','split','merged','continued','redefined')),
  effective_on date,
  evidence_file_version_id uuid NOT NULL REFERENCES filesystem.file_versions(id) ON DELETE RESTRICT,
  observed_at timestamptz NOT NULL DEFAULT now(),
  CHECK (predecessor_id<>successor_id)
);
CREATE INDEX unit_changes_predecessor ON geography.unit_changes(predecessor_id,effective_on);
CREATE INDEX unit_changes_successor ON geography.unit_changes(successor_id,effective_on);
COMMENT ON TABLE geography.unit_changes IS 'Sourced identity/history links, distinct from containment and name aliases.';
