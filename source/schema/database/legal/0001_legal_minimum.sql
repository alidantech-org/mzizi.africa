CREATE SCHEMA legal;
COMMENT ON SCHEMA legal IS 'Minimum legal identity and exact-version evidence targets for domain contracts; detailed legal model follows task 04.';

CREATE TABLE legal.instruments (
  id uuid PRIMARY KEY DEFAULT uuidv7(), code text NOT NULL UNIQUE CHECK(reference.valid_code(code)),
  title text NOT NULL, issuing_country_id uuid REFERENCES reference.countries(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE legal.instruments IS 'Stable legal work identity, independent of publication and textual versions.';

CREATE TABLE legal.instrument_versions (
  id uuid PRIMARY KEY DEFAULT uuidv7(), instrument_id uuid NOT NULL REFERENCES legal.instruments(id) ON DELETE RESTRICT,
  version_code text NOT NULL CHECK(reference.valid_code(version_code)),
  file_version_id uuid NOT NULL REFERENCES filesystem.file_versions(id) ON DELETE RESTRICT,
  language_tag text NOT NULL, published_on date, enacted_on date, commenced_on date, repealed_on date,
  observed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(instrument_id,version_code), UNIQUE(instrument_id,id),
  CHECK(repealed_on IS NULL OR commenced_on IS NULL OR repealed_on>=commenced_on)
);
COMMENT ON TABLE legal.instrument_versions IS 'Exact textual manifestation. Publication, enactment, commencement and repeal are distinct dates.';

CREATE TABLE legal.provisions (
  id uuid PRIMARY KEY DEFAULT uuidv7(), instrument_id uuid NOT NULL REFERENCES legal.instruments(id) ON DELETE RESTRICT,
  code text NOT NULL UNIQUE CHECK(reference.valid_code(code)), title text,
  UNIQUE(instrument_id,id)
);
COMMENT ON TABLE legal.provisions IS 'Stable provision identity, even when wording changes.';

CREATE TABLE legal.provision_versions (
  id uuid PRIMARY KEY DEFAULT uuidv7(), provision_id uuid NOT NULL,
  instrument_id uuid NOT NULL, instrument_version_id uuid NOT NULL,
  file_version_id uuid NOT NULL REFERENCES filesystem.file_versions(id) ON DELETE RESTRICT,
  text_locator text NOT NULL, effective_period daterange,
  observed_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY(instrument_id,provision_id) REFERENCES legal.provisions(instrument_id,id) ON DELETE RESTRICT,
  FOREIGN KEY(instrument_id,instrument_version_id) REFERENCES legal.instrument_versions(instrument_id,id) ON DELETE RESTRICT,
  CHECK(effective_period IS NULL OR NOT isempty(effective_period))
);
CREATE INDEX provision_versions_period ON legal.provision_versions USING gist(effective_period);
COMMENT ON TABLE legal.provision_versions IS 'Exact provision text/version and locator; cited support is not automatically settled legal interpretation.';

ALTER TABLE reference.pattern_bindings ADD COLUMN legal_provision_version_id uuid REFERENCES legal.provision_versions(id) ON DELETE RESTRICT;

CREATE TABLE geography.unit_legal_bases (
  id uuid PRIMARY KEY DEFAULT uuidv7(), unit_id uuid NOT NULL REFERENCES geography.units(id) ON DELETE RESTRICT,
  provision_version_id uuid NOT NULL REFERENCES legal.provision_versions(id) ON DELETE RESTRICT,
  basis_role text NOT NULL CHECK(basis_role IN ('establishes','alters_boundary','defines_status')),
  interpretation_status text NOT NULL CHECK(interpretation_status IN ('reviewed','disputed')),
  evidence_file_version_id uuid NOT NULL REFERENCES filesystem.file_versions(id) ON DELETE RESTRICT,
  UNIQUE(unit_id,provision_version_id,basis_role)
);
COMMENT ON TABLE geography.unit_legal_bases IS 'Typed legal support for a geographic unit; exact provision version and independent cited evidence.';
