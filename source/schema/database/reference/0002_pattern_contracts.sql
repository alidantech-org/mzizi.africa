CREATE FUNCTION reference.immutable_pattern_version() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF ROW(NEW.pattern_id,NEW.version,NEW.file_version_id,NEW.schema_version,NEW.capability,NEW.capability_version,NEW.input_hash,NEW.max_outputs)
     IS DISTINCT FROM
     ROW(OLD.pattern_id,OLD.version,OLD.file_version_id,OLD.schema_version,OLD.capability,OLD.capability_version,OLD.input_hash,OLD.max_outputs) THEN
    RAISE EXCEPTION 'pattern definition version is immutable';
  END IF;
  IF OLD.activated_at IS NOT NULL AND NEW.activated_at IS DISTINCT FROM OLD.activated_at THEN
    RAISE EXCEPTION 'pattern activation is immutable';
  END IF;
  IF OLD.retired_at IS NOT NULL AND NEW.retired_at IS DISTINCT FROM OLD.retired_at THEN
    RAISE EXCEPTION 'pattern retirement is immutable';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER immutable_pattern_version BEFORE UPDATE ON reference.pattern_versions
FOR EACH ROW EXECUTE FUNCTION reference.immutable_pattern_version();

CREATE FUNCTION reference.guard_pattern_dependency() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE found_cycle boolean;
BEGIN
  WITH RECURSIVE upstream(id,path) AS (
    SELECT NEW.upstream_version_id, ARRAY[NEW.upstream_version_id]
    UNION ALL
    SELECT d.upstream_version_id, u.path || d.upstream_version_id
    FROM upstream u JOIN reference.pattern_dependencies d ON d.downstream_version_id=u.id
    WHERE d.upstream_version_id<>ALL(u.path)
  ) SELECT true INTO found_cycle FROM upstream WHERE id=NEW.downstream_version_id LIMIT 1;
  IF found_cycle THEN RAISE EXCEPTION 'pattern definition dependency cycle'; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER pattern_dependency_guard BEFORE INSERT OR UPDATE ON reference.pattern_dependencies
FOR EACH ROW EXECUTE FUNCTION reference.guard_pattern_dependency();

CREATE TABLE reference.pattern_bindings (
  id uuid PRIMARY KEY DEFAULT uuidv7(),
  version_id uuid NOT NULL REFERENCES reference.pattern_versions(id) ON DELETE RESTRICT,
  country_id uuid REFERENCES reference.countries(id) ON DELETE RESTRICT,
  geo_unit_id uuid REFERENCES geography.units(id) ON DELETE RESTRICT,
  period daterange,
  target_contract text NOT NULL,
  prerequisite_contract text NOT NULL,
  UNIQUE NULLS NOT DISTINCT(version_id,country_id,geo_unit_id,period,target_contract),
  CHECK(period IS NULL OR NOT isempty(period))
);
CREATE INDEX pattern_binding_period ON reference.pattern_bindings USING gist(period);
COMMENT ON TABLE reference.pattern_bindings IS 'Approved version applicability; target and prerequisite contracts must resolve through registered schemas before activation.';
