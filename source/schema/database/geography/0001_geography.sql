CREATE EXTENSION IF NOT EXISTS postgis;
CREATE SCHEMA geography;
COMMENT ON SCHEMA geography IS 'Geographic identities, dated relationship systems and sourced boundary representations.';

CREATE TABLE geography.units (
  id uuid PRIMARY KEY DEFAULT uuidv7(), code text NOT NULL UNIQUE CHECK(reference.valid_code(code)),
  name text NOT NULL, type_scheme_id uuid NOT NULL REFERENCES reference.schemes(id) ON DELETE RESTRICT,
  type_value_id uuid NOT NULL,
  existence_status text NOT NULL CHECK(existence_status IN ('established','disputed','hypothetical')),
  source_file_version_id uuid REFERENCES filesystem.file_versions(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY(type_scheme_id,type_value_id) REFERENCES reference.values(scheme_id,id) ON DELETE RESTRICT
);
COMMENT ON TABLE geography.units IS 'Stable area identity. No universal parent or mandatory geometry; code prefix is not containment.';

CREATE FUNCTION geography.require_unit_type_scheme() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF (SELECT code FROM reference.schemes WHERE id=NEW.type_scheme_id) <> 'geo_unit_type' THEN
    RAISE EXCEPTION 'unit type value must belong to geo_unit_type';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER units_type_scheme BEFORE INSERT OR UPDATE OF type_scheme_id ON geography.units
FOR EACH ROW EXECUTE FUNCTION geography.require_unit_type_scheme();

CREATE TABLE geography.names (
  id uuid PRIMARY KEY DEFAULT uuidv7(), unit_id uuid NOT NULL REFERENCES geography.units(id) ON DELETE RESTRICT,
  name text NOT NULL, language_tag text, kind text NOT NULL CHECK(kind IN ('official','historical','alternate')),
  period daterange, evidence_file_version_id uuid REFERENCES filesystem.file_versions(id) ON DELETE RESTRICT,
  observed_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX geo_names_unit_kind ON geography.names(unit_id,kind);
CREATE INDEX geo_names_period ON geography.names USING gist(period);
COMMENT ON TABLE geography.names IS 'Sourced names and aliases with historical period separate from observation time.';

CREATE TABLE geography.relationship_systems (
  id uuid PRIMARY KEY DEFAULT uuidv7(), code text NOT NULL UNIQUE CHECK(reference.valid_code(code)),
  name text NOT NULL, kind text NOT NULL CHECK(kind IN ('administrative','electoral','statistical','historical','other')),
  country_id uuid REFERENCES reference.countries(id) ON DELETE RESTRICT,
  hierarchical boolean NOT NULL, description text NOT NULL
);
COMMENT ON TABLE geography.relationship_systems IS 'Named system in which dated relationships have a defined meaning; null country permits cross-border systems.';

CREATE TABLE geography.relationships (
  id uuid PRIMARY KEY DEFAULT uuidv7(), system_id uuid NOT NULL REFERENCES geography.relationship_systems(id) ON DELETE RESTRICT,
  parent_unit_id uuid NOT NULL REFERENCES geography.units(id) ON DELETE RESTRICT,
  child_unit_id uuid NOT NULL REFERENCES geography.units(id) ON DELETE RESTRICT,
  kind text NOT NULL CHECK(kind IN ('contains','overlaps','adjacent','claimed_by','administers')),
  period daterange, evidence_file_version_id uuid REFERENCES filesystem.file_versions(id) ON DELETE RESTRICT,
  observed_at timestamptz NOT NULL DEFAULT now(),
  claim_status text NOT NULL CHECK(claim_status IN ('verified','disputed','reconstructed')),
  CHECK(parent_unit_id<>child_unit_id), CHECK(period IS NULL OR NOT isempty(period))
);
CREATE INDEX geo_rel_parent ON geography.relationships(system_id,parent_unit_id,kind);
CREATE INDEX geo_rel_child ON geography.relationships(system_id,child_unit_id,kind);
CREATE INDEX geo_rel_period ON geography.relationships USING gist(period);
COMMENT ON TABLE geography.relationships IS 'Dated, sourced assertions. Only verified contains edges of hierarchical systems form official ancestry.';

CREATE FUNCTION geography.guard_relationship() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE bad boolean;
BEGIN
  IF NEW.kind='contains' AND NEW.claim_status='verified' THEN
    IF NOT (SELECT hierarchical FROM geography.relationship_systems WHERE id=NEW.system_id) THEN
      RAISE EXCEPTION 'verified containment requires a hierarchical system';
    END IF;
    WITH RECURSIVE descendants(unit_id, path) AS (
      SELECT NEW.child_unit_id, ARRAY[NEW.child_unit_id]
      UNION ALL
      SELECT r.child_unit_id, d.path || r.child_unit_id
      FROM descendants d JOIN geography.relationships r ON r.parent_unit_id=d.unit_id
      WHERE r.system_id=NEW.system_id AND r.kind='contains' AND r.claim_status='verified'
        AND r.id<>NEW.id AND (NEW.period IS NULL OR r.period IS NULL OR r.period && NEW.period)
        AND NOT r.child_unit_id=ANY(d.path)
    ) SELECT true INTO bad FROM descendants WHERE unit_id=NEW.parent_unit_id LIMIT 1;
    IF bad THEN RAISE EXCEPTION 'containment cycle in relationship system'; END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER geo_rel_guard BEFORE INSERT OR UPDATE ON geography.relationships
FOR EACH ROW EXECUTE FUNCTION geography.guard_relationship();

CREATE TABLE geography.boundary_representations (
  id uuid PRIMARY KEY DEFAULT uuidv7(), unit_id uuid NOT NULL REFERENCES geography.units(id) ON DELETE RESTRICT,
  edition_code text NOT NULL CHECK(reference.valid_code(edition_code)),
  kind text NOT NULL CHECK(kind IN ('official','reconstruction','disputed','hypothetical','member_union','distribution')),
  period daterange, geom geometry(MultiPolygon,4326),
  file_version_id uuid NOT NULL REFERENCES filesystem.file_versions(id) ON DELETE RESTRICT,
  method text NOT NULL, uncertainty text, observed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(unit_id,edition_code), CHECK(period IS NULL OR NOT isempty(period)),
  CHECK(geom IS NULL OR ST_IsValid(geom))
);
CREATE INDEX geo_boundary_geom ON geography.boundary_representations USING gist(geom);
CREATE INDEX geo_boundary_period ON geography.boundary_representations USING gist(period);
COMMENT ON TABLE geography.boundary_representations IS 'Exact sourced or derived boundary edition; null geometry means outline unknown, not empty.';
