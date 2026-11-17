-- Release 0003: media records and branding, and the code grammar that allows a ~qualifier.
--
-- Produced from a schema diff of releases 0001 and 0002 against the regenerated snapshot (sql/schema.sql) and checked: 0001, 0002 and
-- this file give a database with no difference from the snapshot. The grammar change is in the generated validation, not in the tables.
create table "filesystem"."media" (
    "alt_text" character varying(500),
    "caption" character varying(4000),
    "code" character varying(255) not null,
    "created_at" timestamp with time zone not null,
    "deleted_at" timestamp with time zone,
    "file_version_id" uuid,
    "id" uuid not null,
    "kind_id" uuid not null,
    "source_url" character varying(2048),
    "title" character varying(300) not null,
    "updated_at" timestamp with time zone not null,
    "version" integer not null
);

create table "official"."branding" (
    "code" character varying(255) not null,
    "created_at" timestamp with time zone not null,
    "deleted_at" timestamp with time zone,
    "entity_id" uuid,
    "id" uuid not null,
    "individual_id" uuid,
    "kind_id" uuid not null,
    "language_id" uuid not null,
    "media_id" uuid,
    "source_citation_id" uuid,
    "updated_at" timestamp with time zone not null,
    "valid_from" date,
    "valid_until" date,
    "value" character varying(1000),
    "version" integer not null
);

CREATE INDEX ix_media__file_version_id ON filesystem.media USING btree (file_version_id);

CREATE INDEX ix_media__kind_id ON filesystem.media USING btree (kind_id);

CREATE UNIQUE INDEX media_pkey ON filesystem.media USING btree (id);

CREATE UNIQUE INDEX uq_media__code_partial_1 ON filesystem.media USING btree (code) WHERE (deleted_at IS NULL);

CREATE UNIQUE INDEX branding_pkey ON official.branding USING btree (id);

CREATE INDEX ix_branding__entity_id_kind_id ON official.branding USING btree (entity_id, kind_id);

CREATE INDEX ix_branding__individual_id_kind_id ON official.branding USING btree (individual_id, kind_id);

CREATE INDEX ix_branding__language_id ON official.branding USING btree (language_id);

CREATE INDEX ix_branding__media_id ON official.branding USING btree (media_id);

CREATE INDEX ix_branding__source_citation_id ON official.branding USING btree (source_citation_id);

CREATE UNIQUE INDEX uq_branding__code_partial_1 ON official.branding USING btree (code) WHERE (deleted_at IS NULL);

alter table "filesystem"."media" add constraint "media_pkey" PRIMARY KEY using index "media_pkey";

alter table "official"."branding" add constraint "branding_pkey" PRIMARY KEY using index "branding_pkey";

alter table "filesystem"."media" add constraint "fk_media_file_version_id" FOREIGN KEY (file_version_id) REFERENCES filesystem.file_versions(id) ON UPDATE RESTRICT ON DELETE RESTRICT not valid;

alter table "filesystem"."media" validate constraint "fk_media_file_version_id";

alter table "filesystem"."media" add constraint "fk_media_kind_id" FOREIGN KEY (kind_id) REFERENCES reference."values"(id) ON UPDATE RESTRICT ON DELETE RESTRICT not valid;

alter table "filesystem"."media" validate constraint "fk_media_kind_id";

alter table "official"."branding" add constraint "chk_branding_has_exactly_one_identity_owner" CHECK ((((entity_id IS NOT NULL) AND (individual_id IS NULL)) OR ((entity_id IS NULL) AND (individual_id IS NOT NULL)))) not valid;

alter table "official"."branding" validate constraint "chk_branding_has_exactly_one_identity_owner";

alter table "official"."branding" add constraint "chk_branding_validity_window_is_ordered" CHECK (((valid_from IS NULL) OR (valid_until IS NULL) OR (valid_from < valid_until))) not valid;

alter table "official"."branding" validate constraint "chk_branding_validity_window_is_ordered";

alter table "official"."branding" add constraint "fk_branding_entity_id" FOREIGN KEY (entity_id) REFERENCES official.entities(id) ON UPDATE RESTRICT ON DELETE RESTRICT not valid;

alter table "official"."branding" validate constraint "fk_branding_entity_id";

alter table "official"."branding" add constraint "fk_branding_individual_id" FOREIGN KEY (individual_id) REFERENCES official.individuals(id) ON UPDATE RESTRICT ON DELETE RESTRICT not valid;

alter table "official"."branding" validate constraint "fk_branding_individual_id";

alter table "official"."branding" add constraint "fk_branding_kind_id" FOREIGN KEY (kind_id) REFERENCES reference."values"(id) ON UPDATE RESTRICT ON DELETE RESTRICT not valid;

alter table "official"."branding" validate constraint "fk_branding_kind_id";

alter table "official"."branding" add constraint "fk_branding_language_id" FOREIGN KEY (language_id) REFERENCES reference.languages(id) ON UPDATE RESTRICT ON DELETE RESTRICT not valid;

alter table "official"."branding" validate constraint "fk_branding_language_id";

alter table "official"."branding" add constraint "fk_branding_media_id" FOREIGN KEY (media_id) REFERENCES filesystem.media(id) ON UPDATE RESTRICT ON DELETE RESTRICT not valid;

alter table "official"."branding" validate constraint "fk_branding_media_id";

alter table "official"."branding" add constraint "fk_branding_source_citation_id" FOREIGN KEY (source_citation_id) REFERENCES source.citations(id) ON UPDATE RESTRICT ON DELETE RESTRICT not valid;

alter table "official"."branding" validate constraint "fk_branding_source_citation_id";

