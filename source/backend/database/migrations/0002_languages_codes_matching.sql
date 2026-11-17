-- Release 0002: the language registry, codes on every seedable table, and the text-matching extensions.
--
-- Written from a schema diff of release 0001 against the regenerated snapshot (sql/schema.sql) and then verified: 0001 followed by
-- this file gives a database with no difference from the snapshot.
--
-- Run as a role that may create extensions (the application role may not). The tables it changes must be empty: the new NOT NULL
-- columns (`code`, `language_id`, `is_default`) have no default, so the release stops on a table that already holds rows.
create extension if not exists "fuzzystrmatch" with schema "public" version '1.2';

create extension if not exists "pg_trgm" with schema "public" version '1.6';

create extension if not exists "unaccent" with schema "public" version '1.1';

drop index if exists "geography"."ix_names__language_tag";

drop index if exists "geography"."uq_names__feature_id_name_kind_id_language_tag_name";

drop index if exists "legal"."ix_provision_translations__language_tag";

drop index if exists "legal"."uq_provision_translations__provision_version_id_language_tag_ki";

drop index if exists "official"."uq_names__entity_id_individual_id_name_kind_id_language_tag_nam";

drop index if exists "official"."uq_names__entity_id_language_tag_partial_2";

drop index if exists "official"."uq_names__individual_id_language_tag_partial_3";

drop index if exists "reference"."ix_value_labels__language_tag";

drop index if exists "reference"."uq_value_labels__value_id_language_tag_label_kind_label";

create table "reference"."language_names" (
    "created_at" timestamp with time zone not null,
    "deleted_at" timestamp with time zone,
    "id" uuid not null,
    "in_language_id" uuid not null,
    "language_id" uuid not null,
    "name" character varying(300) not null,
    "name_kind" text not null,
    "updated_at" timestamp with time zone not null,
    "valid_from" date,
    "valid_until" date,
    "version" integer not null
);

create table "reference"."languages" (
    "code" character varying(255) not null,
    "created_at" timestamp with time zone not null,
    "deleted_at" timestamp with time zone,
    "direction_id" uuid,
    "family_id" uuid,
    "glottocode" character(8),
    "id" uuid not null,
    "iso6391" character(2),
    "iso6392" character(3),
    "iso6393" character(3),
    "kind_id" uuid not null,
    "name" character varying(300) not null,
    "parent_id" uuid,
    "script_id" uuid,
    "status_id" uuid,
    "updated_at" timestamp with time zone not null,
    "version" integer not null
);

alter table "civic"."bids" add column "code" character varying(255) not null;

alter table "civic"."contracts" add column "code" character varying(255) not null;

alter table "civic"."deliveries" add column "code" character varying(255) not null;

alter table "finance"."debts" add column "code" character varying(255) not null;

alter table "finance"."flows" add column "code" character varying(255) not null;

alter table "geography"."names" drop column "language_tag";

alter table "geography"."names" add column "is_default" boolean not null;

alter table "geography"."names" add column "language_id" uuid not null;

alter table "governance"."holders" add column "code" character varying(255) not null;

alter table "legal"."amendments" add column "code" character varying(255) not null;

alter table "legal"."provision_translations" drop column "language_tag";

alter table "legal"."provision_translations" add column "language_id" uuid not null;

alter table "legal"."provision_versions" drop column "language_tag";

alter table "legal"."provision_versions" add column "language_id" uuid not null;

alter table "official"."contacts" add column "code" character varying(255) not null;

alter table "official"."names" drop column "language_tag";

alter table "official"."names" add column "language_id" uuid not null;

alter table "official"."relationships" add column "code" character varying(255) not null;

alter table "politics"."alignments" add column "code" character varying(255) not null;

alter table "politics"."candidates" add column "code" character varying(255) not null;

alter table "politics"."manifesto_items" add column "code" character varying(255) not null;

alter table "politics"."manifestos" add column "code" character varying(255) not null;

alter table "politics"."memberships" add column "code" character varying(255) not null;

alter table "reference"."value_labels" drop column "language_tag";

alter table "reference"."value_labels" add column "language_id" uuid not null;

alter table "source"."attributions" add column "code" character varying(255) not null;

alter table "source"."citations" add column "code" character varying(255) not null;

alter table "source"."publication_receipts" add column "code" character varying(255) not null;

alter table "source"."verifications" add column "code" character varying(255) not null;

CREATE UNIQUE INDEX uq_bids__code_partial_1 ON civic.bids USING btree (code) WHERE (deleted_at IS NULL);

CREATE UNIQUE INDEX uq_contracts__code_partial_1 ON civic.contracts USING btree (code) WHERE (deleted_at IS NULL);

CREATE UNIQUE INDEX uq_deliveries__code_partial_1 ON civic.deliveries USING btree (code) WHERE (deleted_at IS NULL);

CREATE UNIQUE INDEX uq_debts__code_partial_1 ON finance.debts USING btree (code) WHERE (deleted_at IS NULL);

CREATE UNIQUE INDEX uq_flows__code_partial_1 ON finance.flows USING btree (code) WHERE (deleted_at IS NULL);

CREATE INDEX ix_names__language_id ON geography.names USING btree (language_id);

CREATE UNIQUE INDEX uq_names__feature_id_language_id_partial_2 ON geography.names USING btree (feature_id, language_id) WHERE (is_default = true);

CREATE UNIQUE INDEX uq_names__feature_id_name_kind_id_language_id_name ON geography.names USING btree (feature_id, name_kind_id, language_id, name);

CREATE UNIQUE INDEX uq_holders__code_partial_1 ON governance.holders USING btree (code) WHERE (deleted_at IS NULL);

CREATE INDEX ix_provision_translations__language_id ON legal.provision_translations USING btree (language_id);

CREATE UNIQUE INDEX uq_amendments__code_partial_1 ON legal.amendments USING btree (code) WHERE (deleted_at IS NULL);

CREATE UNIQUE INDEX uq_provision_translations__provision_version_id_language_id_kin ON legal.provision_translations USING btree (provision_version_id, language_id, kind);

CREATE UNIQUE INDEX uq_contacts__code_partial_1 ON official.contacts USING btree (code) WHERE (deleted_at IS NULL);

CREATE UNIQUE INDEX uq_names__entity_id_individual_id_name_kind_id_language_id_name ON official.names USING btree (entity_id, individual_id, name_kind_id, language_id, name);

CREATE UNIQUE INDEX uq_names__entity_id_language_id_partial_2 ON official.names USING btree (entity_id, language_id) WHERE (is_preferred = true);

CREATE UNIQUE INDEX uq_names__individual_id_language_id_partial_3 ON official.names USING btree (individual_id, language_id) WHERE (is_preferred = true);

CREATE UNIQUE INDEX uq_relationships__code_partial_1 ON official.relationships USING btree (code) WHERE (deleted_at IS NULL);

CREATE UNIQUE INDEX uq_alignments__code_partial_1 ON politics.alignments USING btree (code) WHERE (deleted_at IS NULL);

CREATE UNIQUE INDEX uq_candidates__code_partial_1 ON politics.candidates USING btree (code) WHERE (deleted_at IS NULL);

CREATE UNIQUE INDEX uq_manifesto_items__code_partial_1 ON politics.manifesto_items USING btree (code) WHERE (deleted_at IS NULL);

CREATE UNIQUE INDEX uq_manifestos__code_partial_1 ON politics.manifestos USING btree (code) WHERE (deleted_at IS NULL);

CREATE UNIQUE INDEX uq_memberships__code_partial_1 ON politics.memberships USING btree (code) WHERE (deleted_at IS NULL);

CREATE INDEX ix_language_names__in_language_id ON reference.language_names USING btree (in_language_id);

CREATE INDEX ix_language_names__language_id ON reference.language_names USING btree (language_id);

CREATE INDEX ix_languages__family_id ON reference.languages USING btree (family_id);

CREATE INDEX ix_languages__kind_id ON reference.languages USING btree (kind_id);

CREATE INDEX ix_languages__name ON reference.languages USING btree (name);

CREATE INDEX ix_languages__parent_id ON reference.languages USING btree (parent_id);

CREATE INDEX ix_languages__script_id ON reference.languages USING btree (script_id);

CREATE INDEX ix_value_labels__language_id ON reference.value_labels USING btree (language_id);

CREATE UNIQUE INDEX language_names_pkey ON reference.language_names USING btree (id);

CREATE UNIQUE INDEX languages_pkey ON reference.languages USING btree (id);

CREATE UNIQUE INDEX uq_language_names__language_id_in_language_id_name_kind_name ON reference.language_names USING btree (language_id, in_language_id, name_kind, name);

CREATE UNIQUE INDEX uq_languages__code_partial_1 ON reference.languages USING btree (code) WHERE (deleted_at IS NULL);

CREATE UNIQUE INDEX uq_languages__glottocode ON reference.languages USING btree (glottocode);

CREATE UNIQUE INDEX uq_languages__iso6391 ON reference.languages USING btree (iso6391);

CREATE UNIQUE INDEX uq_languages__iso6393 ON reference.languages USING btree (iso6393);

CREATE UNIQUE INDEX uq_value_labels__value_id_language_id_label_kind_label ON reference.value_labels USING btree (value_id, language_id, label_kind, label);

CREATE UNIQUE INDEX uq_attributions__code_partial_1 ON source.attributions USING btree (code) WHERE (deleted_at IS NULL);

CREATE UNIQUE INDEX uq_citations__code_partial_1 ON source.citations USING btree (code) WHERE (deleted_at IS NULL);

CREATE UNIQUE INDEX uq_publication_receipts__code_partial_1 ON source.publication_receipts USING btree (code) WHERE (deleted_at IS NULL);

CREATE UNIQUE INDEX uq_verifications__code_partial_1 ON source.verifications USING btree (code) WHERE (deleted_at IS NULL);

alter table "reference"."language_names" add constraint "language_names_pkey" PRIMARY KEY using index "language_names_pkey";

alter table "reference"."languages" add constraint "languages_pkey" PRIMARY KEY using index "languages_pkey";

alter table "geography"."names" add constraint "fk_names_language_id" FOREIGN KEY (language_id) REFERENCES reference.languages(id) ON UPDATE RESTRICT ON DELETE RESTRICT not valid;

alter table "geography"."names" validate constraint "fk_names_language_id";

alter table "legal"."provision_translations" add constraint "fk_provision_translations_language_id" FOREIGN KEY (language_id) REFERENCES reference.languages(id) ON UPDATE RESTRICT ON DELETE RESTRICT not valid;

alter table "legal"."provision_translations" validate constraint "fk_provision_translations_language_id";

alter table "legal"."provision_versions" add constraint "fk_provision_versions_language_id" FOREIGN KEY (language_id) REFERENCES reference.languages(id) ON UPDATE RESTRICT ON DELETE RESTRICT not valid;

alter table "legal"."provision_versions" validate constraint "fk_provision_versions_language_id";

alter table "official"."names" add constraint "fk_names_language_id" FOREIGN KEY (language_id) REFERENCES reference.languages(id) ON UPDATE RESTRICT ON DELETE RESTRICT not valid;

alter table "official"."names" validate constraint "fk_names_language_id";

alter table "reference"."language_names" add constraint "chk_language_names_validity_window_is_ordered" CHECK (((valid_from IS NULL) OR (valid_until IS NULL) OR (valid_from < valid_until))) not valid;

alter table "reference"."language_names" validate constraint "chk_language_names_validity_window_is_ordered";

alter table "reference"."language_names" add constraint "fk_language_names_in_language_id" FOREIGN KEY (in_language_id) REFERENCES reference.languages(id) ON UPDATE RESTRICT ON DELETE RESTRICT not valid;

alter table "reference"."language_names" validate constraint "fk_language_names_in_language_id";

alter table "reference"."language_names" add constraint "fk_language_names_language_id" FOREIGN KEY (language_id) REFERENCES reference.languages(id) ON UPDATE RESTRICT ON DELETE RESTRICT not valid;

alter table "reference"."language_names" validate constraint "fk_language_names_language_id";

alter table "reference"."languages" add constraint "chk_languages_language_is_not_its_own_parent" CHECK ((id <> parent_id)) not valid;

alter table "reference"."languages" validate constraint "chk_languages_language_is_not_its_own_parent";

alter table "reference"."languages" add constraint "fk_languages_direction_id" FOREIGN KEY (direction_id) REFERENCES reference."values"(id) ON UPDATE RESTRICT ON DELETE RESTRICT not valid;

alter table "reference"."languages" validate constraint "fk_languages_direction_id";

alter table "reference"."languages" add constraint "fk_languages_family_id" FOREIGN KEY (family_id) REFERENCES reference."values"(id) ON UPDATE RESTRICT ON DELETE RESTRICT not valid;

alter table "reference"."languages" validate constraint "fk_languages_family_id";

alter table "reference"."languages" add constraint "fk_languages_kind_id" FOREIGN KEY (kind_id) REFERENCES reference."values"(id) ON UPDATE RESTRICT ON DELETE RESTRICT not valid;

alter table "reference"."languages" validate constraint "fk_languages_kind_id";

alter table "reference"."languages" add constraint "fk_languages_parent_id" FOREIGN KEY (parent_id) REFERENCES reference.languages(id) ON UPDATE RESTRICT ON DELETE RESTRICT not valid;

alter table "reference"."languages" validate constraint "fk_languages_parent_id";

alter table "reference"."languages" add constraint "fk_languages_script_id" FOREIGN KEY (script_id) REFERENCES reference."values"(id) ON UPDATE RESTRICT ON DELETE RESTRICT not valid;

alter table "reference"."languages" validate constraint "fk_languages_script_id";

alter table "reference"."languages" add constraint "fk_languages_status_id" FOREIGN KEY (status_id) REFERENCES reference."values"(id) ON UPDATE RESTRICT ON DELETE RESTRICT not valid;

alter table "reference"."languages" validate constraint "fk_languages_status_id";

alter table "reference"."value_labels" add constraint "fk_value_labels_language_id" FOREIGN KEY (language_id) REFERENCES reference.languages(id) ON UPDATE RESTRICT ON DELETE RESTRICT not valid;

alter table "reference"."value_labels" validate constraint "fk_value_labels_language_id";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION reference.languages__language_parent_acyclic()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW."parent_id" IS NOT NULL AND EXISTS (
    WITH RECURSIVE chain(id) AS (
      SELECT NEW."parent_id"
      UNION
      SELECT t."parent_id" FROM "reference"."languages" t JOIN chain ON t."id" = chain.id WHERE t."parent_id" IS NOT NULL
    ) SELECT 1 FROM chain WHERE id = NEW."id"
  ) THEN
    RAISE EXCEPTION 'languages.parent_id would create a cycle' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END
$function$
;

CREATE OR REPLACE FUNCTION reference.scheme_languages_direction_id()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW."direction_id" IS NOT NULL AND NOT EXISTS (
    SELECT 1
    FROM "reference"."values" v
    JOIN "reference"."schemes" s ON s."id" = v."scheme_id"
    WHERE v."id" = NEW."direction_id" AND s."code" = 'ref.sch.ref.text.direction'
    FOR SHARE OF v, s
  ) THEN
    RAISE EXCEPTION 'referenced value belongs to a different scheme' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION reference.scheme_languages_direction_id_code()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF OLD."code" = 'ref.sch.ref.text.direction' AND NEW."code" IS DISTINCT FROM OLD."code" AND EXISTS (
    SELECT 1 FROM "reference"."languages" t
    JOIN "reference"."values" v ON v."id" = t."direction_id"
    WHERE v."scheme_id" = OLD."id"
  ) THEN
    RAISE EXCEPTION 'cannot rename a scheme used by a scheme-constrained link' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION reference.scheme_languages_direction_id_membership()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW."scheme_id" IS DISTINCT FROM OLD."scheme_id" AND EXISTS (
    SELECT 1 FROM "reference"."languages" t WHERE t."direction_id" = OLD."id"
  ) THEN
    RAISE EXCEPTION 'cannot move a value used by a scheme-constrained link' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION reference.scheme_languages_family_id()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW."family_id" IS NOT NULL AND NOT EXISTS (
    SELECT 1
    FROM "reference"."values" v
    JOIN "reference"."schemes" s ON s."id" = v."scheme_id"
    WHERE v."id" = NEW."family_id" AND s."code" = 'ref.sch.ref.language.family'
    FOR SHARE OF v, s
  ) THEN
    RAISE EXCEPTION 'referenced value belongs to a different scheme' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION reference.scheme_languages_family_id_code()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF OLD."code" = 'ref.sch.ref.language.family' AND NEW."code" IS DISTINCT FROM OLD."code" AND EXISTS (
    SELECT 1 FROM "reference"."languages" t
    JOIN "reference"."values" v ON v."id" = t."family_id"
    WHERE v."scheme_id" = OLD."id"
  ) THEN
    RAISE EXCEPTION 'cannot rename a scheme used by a scheme-constrained link' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION reference.scheme_languages_family_id_membership()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW."scheme_id" IS DISTINCT FROM OLD."scheme_id" AND EXISTS (
    SELECT 1 FROM "reference"."languages" t WHERE t."family_id" = OLD."id"
  ) THEN
    RAISE EXCEPTION 'cannot move a value used by a scheme-constrained link' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION reference.scheme_languages_kind_id()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW."kind_id" IS NOT NULL AND NOT EXISTS (
    SELECT 1
    FROM "reference"."values" v
    JOIN "reference"."schemes" s ON s."id" = v."scheme_id"
    WHERE v."id" = NEW."kind_id" AND s."code" = 'ref.sch.ref.language.kind'
    FOR SHARE OF v, s
  ) THEN
    RAISE EXCEPTION 'referenced value belongs to a different scheme' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION reference.scheme_languages_kind_id_code()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF OLD."code" = 'ref.sch.ref.language.kind' AND NEW."code" IS DISTINCT FROM OLD."code" AND EXISTS (
    SELECT 1 FROM "reference"."languages" t
    JOIN "reference"."values" v ON v."id" = t."kind_id"
    WHERE v."scheme_id" = OLD."id"
  ) THEN
    RAISE EXCEPTION 'cannot rename a scheme used by a scheme-constrained link' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION reference.scheme_languages_kind_id_membership()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW."scheme_id" IS DISTINCT FROM OLD."scheme_id" AND EXISTS (
    SELECT 1 FROM "reference"."languages" t WHERE t."kind_id" = OLD."id"
  ) THEN
    RAISE EXCEPTION 'cannot move a value used by a scheme-constrained link' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION reference.scheme_languages_script_id()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW."script_id" IS NOT NULL AND NOT EXISTS (
    SELECT 1
    FROM "reference"."values" v
    JOIN "reference"."schemes" s ON s."id" = v."scheme_id"
    WHERE v."id" = NEW."script_id" AND s."code" = 'ref.sch.ref.script'
    FOR SHARE OF v, s
  ) THEN
    RAISE EXCEPTION 'referenced value belongs to a different scheme' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION reference.scheme_languages_script_id_code()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF OLD."code" = 'ref.sch.ref.script' AND NEW."code" IS DISTINCT FROM OLD."code" AND EXISTS (
    SELECT 1 FROM "reference"."languages" t
    JOIN "reference"."values" v ON v."id" = t."script_id"
    WHERE v."scheme_id" = OLD."id"
  ) THEN
    RAISE EXCEPTION 'cannot rename a scheme used by a scheme-constrained link' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION reference.scheme_languages_script_id_membership()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW."scheme_id" IS DISTINCT FROM OLD."scheme_id" AND EXISTS (
    SELECT 1 FROM "reference"."languages" t WHERE t."script_id" = OLD."id"
  ) THEN
    RAISE EXCEPTION 'cannot move a value used by a scheme-constrained link' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION reference.scheme_languages_status_id()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW."status_id" IS NOT NULL AND NOT EXISTS (
    SELECT 1
    FROM "reference"."values" v
    JOIN "reference"."schemes" s ON s."id" = v."scheme_id"
    WHERE v."id" = NEW."status_id" AND s."code" = 'ref.sch.ref.language.status'
    FOR SHARE OF v, s
  ) THEN
    RAISE EXCEPTION 'referenced value belongs to a different scheme' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION reference.scheme_languages_status_id_code()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF OLD."code" = 'ref.sch.ref.language.status' AND NEW."code" IS DISTINCT FROM OLD."code" AND EXISTS (
    SELECT 1 FROM "reference"."languages" t
    JOIN "reference"."values" v ON v."id" = t."status_id"
    WHERE v."scheme_id" = OLD."id"
  ) THEN
    RAISE EXCEPTION 'cannot rename a scheme used by a scheme-constrained link' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION reference.scheme_languages_status_id_membership()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW."scheme_id" IS DISTINCT FROM OLD."scheme_id" AND EXISTS (
    SELECT 1 FROM "reference"."languages" t WHERE t."status_id" = OLD."id"
  ) THEN
    RAISE EXCEPTION 'cannot move a value used by a scheme-constrained link' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE TRIGGER scheme_languages_direction_id BEFORE INSERT OR UPDATE OF direction_id ON reference.languages FOR EACH ROW EXECUTE FUNCTION reference.scheme_languages_direction_id();

CREATE TRIGGER scheme_languages_family_id BEFORE INSERT OR UPDATE OF family_id ON reference.languages FOR EACH ROW EXECUTE FUNCTION reference.scheme_languages_family_id();

CREATE TRIGGER scheme_languages_kind_id BEFORE INSERT OR UPDATE OF kind_id ON reference.languages FOR EACH ROW EXECUTE FUNCTION reference.scheme_languages_kind_id();

CREATE TRIGGER scheme_languages_script_id BEFORE INSERT OR UPDATE OF script_id ON reference.languages FOR EACH ROW EXECUTE FUNCTION reference.scheme_languages_script_id();

CREATE TRIGGER scheme_languages_status_id BEFORE INSERT OR UPDATE OF status_id ON reference.languages FOR EACH ROW EXECUTE FUNCTION reference.scheme_languages_status_id();

CREATE TRIGGER tr_languages__language_parent_acyclic BEFORE INSERT OR UPDATE OF parent_id ON reference.languages FOR EACH ROW EXECUTE FUNCTION reference.languages__language_parent_acyclic();

CREATE TRIGGER reference_scheme_languages_direction_id_code BEFORE UPDATE OF code ON reference.schemes FOR EACH ROW EXECUTE FUNCTION reference.scheme_languages_direction_id_code();

CREATE TRIGGER reference_scheme_languages_family_id_code BEFORE UPDATE OF code ON reference.schemes FOR EACH ROW EXECUTE FUNCTION reference.scheme_languages_family_id_code();

CREATE TRIGGER reference_scheme_languages_kind_id_code BEFORE UPDATE OF code ON reference.schemes FOR EACH ROW EXECUTE FUNCTION reference.scheme_languages_kind_id_code();

CREATE TRIGGER reference_scheme_languages_script_id_code BEFORE UPDATE OF code ON reference.schemes FOR EACH ROW EXECUTE FUNCTION reference.scheme_languages_script_id_code();

CREATE TRIGGER reference_scheme_languages_status_id_code BEFORE UPDATE OF code ON reference.schemes FOR EACH ROW EXECUTE FUNCTION reference.scheme_languages_status_id_code();

CREATE TRIGGER reference_scheme_languages_direction_id_membership BEFORE UPDATE OF scheme_id ON reference."values" FOR EACH ROW EXECUTE FUNCTION reference.scheme_languages_direction_id_membership();

CREATE TRIGGER reference_scheme_languages_family_id_membership BEFORE UPDATE OF scheme_id ON reference."values" FOR EACH ROW EXECUTE FUNCTION reference.scheme_languages_family_id_membership();

CREATE TRIGGER reference_scheme_languages_kind_id_membership BEFORE UPDATE OF scheme_id ON reference."values" FOR EACH ROW EXECUTE FUNCTION reference.scheme_languages_kind_id_membership();

CREATE TRIGGER reference_scheme_languages_script_id_membership BEFORE UPDATE OF scheme_id ON reference."values" FOR EACH ROW EXECUTE FUNCTION reference.scheme_languages_script_id_membership();

CREATE TRIGGER reference_scheme_languages_status_id_membership BEFORE UPDATE OF scheme_id ON reference."values" FOR EACH ROW EXECUTE FUNCTION reference.scheme_languages_status_id_membership();

