import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Places, occupancy, expected presence and contact points (PLACES_AND_PRESENCE_ASSESSMENT.md, TSK-2107BCCA74E8).
 * Schema `place`: places (one self-referencing tree), occupancies, occupancy_links, expectations. Schema `contact`: points.
 * No source columns: evidence is source.attributions and source.verifications on these target kinds. Foreign keys stay
 * inside `place`; subjects, scopes, geography units and classifications are plain ids checked by the integrity jobs.
 * Does not touch organization.locations (retired by a later migration once its data is mapped).
 */
export class PlacesAndContacts1794100000000 implements MigrationInterface {
  name = "PlacesAndContacts1794100000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("CREATE SCHEMA IF NOT EXISTS \"contact\"");
    await queryRunner.query("CREATE SCHEMA IF NOT EXISTS \"place\"");
    await queryRunner.query("CREATE TYPE \"contact\".\"points_channel_enum\" AS ENUM('email', 'fax', 'messaging', 'phone', 'postal')");
    await queryRunner.query("CREATE TYPE \"contact\".\"points_valid_from_precision_enum\" AS ENUM('approximate', 'century', 'decade', 'exact', 'month', 'year')");
    await queryRunner.query("CREATE TYPE \"contact\".\"points_valid_to_precision_enum\" AS ENUM('approximate', 'century', 'decade', 'exact', 'month', 'year')");
    await queryRunner.query("CREATE TYPE \"contact\".\"points_visibility_enum\" AS ENUM('internal', 'public', 'restricted')");
    await queryRunner.query("CREATE TABLE \"contact\".\"points\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"channel\" \"contact\".\"points_channel_enum\" NOT NULL, \"created_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"is_current\" boolean NOT NULL, \"label\" character varying(300), \"scope_id\" uuid NOT NULL, \"scope_kind\" character varying(100) NOT NULL, \"updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"valid_from\" date, \"valid_from_precision\" \"contact\".\"points_valid_from_precision_enum\", \"valid_to\" date, \"valid_to_precision\" \"contact\".\"points_valid_to_precision_enum\", \"value\" character varying(500) NOT NULL, \"version\" integer NOT NULL, \"visibility\" \"contact\".\"points_visibility_enum\" NOT NULL, CONSTRAINT \"PK_57a558e5e1e17668324b165dadf\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE INDEX \"idx_contact_point_scope\" ON \"contact\".\"points\" (\"scope_kind\", \"scope_id\", \"channel\") ");
    await queryRunner.query("CREATE TYPE \"place\".\"expectations_basis_enum\" AS ENUM('legal_rule', 'pattern', 'plan')");
    await queryRunner.query("CREATE TYPE \"place\".\"expectations_status_enum\" AS ENUM('ceased', 'expected', 'identified', 'no_details_found', 'not_applicable', 'researching')");
    await queryRunner.query("CREATE TYPE \"place\".\"expectations_valid_from_precision_enum\" AS ENUM('approximate', 'century', 'decade', 'exact', 'month', 'year')");
    await queryRunner.query("CREATE TYPE \"place\".\"expectations_valid_to_precision_enum\" AS ENUM('approximate', 'century', 'decade', 'exact', 'month', 'year')");
    await queryRunner.query("CREATE TABLE \"place\".\"expectations\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"basis\" \"place\".\"expectations_basis_enum\" NOT NULL, \"created_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"facility_type_id\" uuid, \"is_current\" boolean NOT NULL, \"max_count\" integer, \"min_count\" integer NOT NULL, \"resolved_occupancy_id\" uuid, \"role_id\" uuid NOT NULL, \"scope_geo_unit_id\" uuid, \"status\" \"place\".\"expectations_status_enum\" NOT NULL, \"subject_id\" uuid NOT NULL, \"subject_kind\" character varying(100) NOT NULL, \"updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"valid_from\" date, \"valid_from_precision\" \"place\".\"expectations_valid_from_precision_enum\", \"valid_to\" date, \"valid_to_precision\" \"place\".\"expectations_valid_to_precision_enum\", \"version\" integer NOT NULL, CONSTRAINT \"PK_93097bcea292f216d6232f54717\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE INDEX \"idx_expectation_status\" ON \"place\".\"expectations\" (\"status\") ");
    await queryRunner.query("CREATE INDEX \"idx_expectation_scope\" ON \"place\".\"expectations\" (\"scope_geo_unit_id\") ");
    await queryRunner.query("CREATE INDEX \"idx_expectation_subject\" ON \"place\".\"expectations\" (\"subject_kind\", \"subject_id\") ");
    await queryRunner.query("CREATE TYPE \"place\".\"places_kind_enum\" AS ENUM('floor', 'room', 'service_point', 'site', 'structure', 'unit', 'wing')");
    await queryRunner.query("CREATE TYPE \"place\".\"places_status_enum\" AS ENUM('closed', 'demolished', 'in_use', 'planned', 'vacant')");
    await queryRunner.query("CREATE TYPE \"place\".\"places_valid_from_precision_enum\" AS ENUM('approximate', 'century', 'decade', 'exact', 'month', 'year')");
    await queryRunner.query("CREATE TYPE \"place\".\"places_valid_to_precision_enum\" AS ENUM('approximate', 'century', 'decade', 'exact', 'month', 'year')");
    await queryRunner.query("CREATE TABLE \"place\".\"places\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"address_text\" text, \"available_from\" date, \"building_type_id\" uuid, \"created_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"is_current\" boolean NOT NULL, \"kind\" \"place\".\"places_kind_enum\" NOT NULL, \"latitude\" numeric(9,6), \"located_in_unit_id\" uuid, \"longitude\" numeric(9,6), \"name\" character varying(300) NOT NULL, \"parent_id\" uuid, \"status\" \"place\".\"places_status_enum\" NOT NULL, \"updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"valid_from\" date, \"valid_from_precision\" \"place\".\"places_valid_from_precision_enum\", \"valid_to\" date, \"valid_to_precision\" \"place\".\"places_valid_to_precision_enum\", \"version\" integer NOT NULL, CONSTRAINT \"PK_1afab86e226b4c3bc9a74465c12\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE INDEX \"idx_place_kind_status\" ON \"place\".\"places\" (\"kind\", \"status\") ");
    await queryRunner.query("CREATE INDEX \"idx_place_located_in\" ON \"place\".\"places\" (\"located_in_unit_id\") ");
    await queryRunner.query("CREATE INDEX \"idx_place_parent\" ON \"place\".\"places\" (\"parent_id\") ");
    await queryRunner.query("CREATE TYPE \"place\".\"occupancies_status_enum\" AS ENUM('active', 'closed', 'expected', 'moved')");
    await queryRunner.query("CREATE TYPE \"place\".\"occupancies_valid_from_precision_enum\" AS ENUM('approximate', 'century', 'decade', 'exact', 'month', 'year')");
    await queryRunner.query("CREATE TYPE \"place\".\"occupancies_valid_to_precision_enum\" AS ENUM('approximate', 'century', 'decade', 'exact', 'month', 'year')");
    await queryRunner.query("CREATE TABLE \"place\".\"occupancies\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"created_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"is_current\" boolean NOT NULL, \"place_id\" uuid NOT NULL, \"role_id\" uuid NOT NULL, \"status\" \"place\".\"occupancies_status_enum\" NOT NULL, \"subject_id\" uuid NOT NULL, \"subject_kind\" character varying(100) NOT NULL, \"updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"valid_from\" date, \"valid_from_precision\" \"place\".\"occupancies_valid_from_precision_enum\", \"valid_to\" date, \"valid_to_precision\" \"place\".\"occupancies_valid_to_precision_enum\", \"version\" integer NOT NULL, CONSTRAINT \"PK_0fe5d113cbd6e522b3c4e1a3b86\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE INDEX \"idx_occupancy_place\" ON \"place\".\"occupancies\" (\"place_id\") ");
    await queryRunner.query("CREATE INDEX \"idx_occupancy_subject\" ON \"place\".\"occupancies\" (\"subject_kind\", \"subject_id\") ");
    await queryRunner.query("CREATE TYPE \"place\".\"occupancy_links_kind_enum\" AS ENUM('merge', 'move', 'split')");
    await queryRunner.query("CREATE TYPE \"place\".\"occupancy_links_valid_from_precision_enum\" AS ENUM('approximate', 'century', 'decade', 'exact', 'month', 'year')");
    await queryRunner.query("CREATE TYPE \"place\".\"occupancy_links_valid_to_precision_enum\" AS ENUM('approximate', 'century', 'decade', 'exact', 'month', 'year')");
    await queryRunner.query("CREATE TABLE \"place\".\"occupancy_links\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"created_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"is_current\" boolean NOT NULL, \"kind\" \"place\".\"occupancy_links_kind_enum\" NOT NULL, \"predecessor_id\" uuid NOT NULL, \"successor_id\" uuid NOT NULL, \"updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"valid_from\" date, \"valid_from_precision\" \"place\".\"occupancy_links_valid_from_precision_enum\", \"valid_to\" date, \"valid_to_precision\" \"place\".\"occupancy_links_valid_to_precision_enum\", \"version\" integer NOT NULL, CONSTRAINT \"PK_39ec42d7d04d1f61b6bbed1ab91\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE INDEX \"idx_occupancy_link_successor\" ON \"place\".\"occupancy_links\" (\"successor_id\") ");
    await queryRunner.query("CREATE UNIQUE INDEX \"idx_occupancy_link_pair\" ON \"place\".\"occupancy_links\" (\"predecessor_id\", \"successor_id\") ");
    await queryRunner.query("ALTER TABLE \"place\".\"occupancies\" ADD CONSTRAINT \"FK_78b45a54a21b98eb1176f6a3d10\" FOREIGN KEY (\"place_id\") REFERENCES \"place\".\"places\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
    await queryRunner.query("ALTER TABLE \"place\".\"occupancy_links\" ADD CONSTRAINT \"FK_ba23db6759dc2c245a23a61b664\" FOREIGN KEY (\"predecessor_id\") REFERENCES \"place\".\"occupancies\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE \"place\".\"occupancy_links\" DROP CONSTRAINT \"FK_ba23db6759dc2c245a23a61b664\"");
    await queryRunner.query("ALTER TABLE \"place\".\"occupancies\" DROP CONSTRAINT \"FK_78b45a54a21b98eb1176f6a3d10\"");
    await queryRunner.query("DROP INDEX \"place\".\"idx_occupancy_link_pair\"");
    await queryRunner.query("DROP INDEX \"place\".\"idx_occupancy_link_successor\"");
    await queryRunner.query("DROP TABLE \"place\".\"occupancy_links\"");
    await queryRunner.query("DROP TYPE \"place\".\"occupancy_links_valid_to_precision_enum\"");
    await queryRunner.query("DROP TYPE \"place\".\"occupancy_links_valid_from_precision_enum\"");
    await queryRunner.query("DROP TYPE \"place\".\"occupancy_links_kind_enum\"");
    await queryRunner.query("DROP INDEX \"place\".\"idx_occupancy_subject\"");
    await queryRunner.query("DROP INDEX \"place\".\"idx_occupancy_place\"");
    await queryRunner.query("DROP TABLE \"place\".\"occupancies\"");
    await queryRunner.query("DROP TYPE \"place\".\"occupancies_valid_to_precision_enum\"");
    await queryRunner.query("DROP TYPE \"place\".\"occupancies_valid_from_precision_enum\"");
    await queryRunner.query("DROP TYPE \"place\".\"occupancies_status_enum\"");
    await queryRunner.query("DROP INDEX \"place\".\"idx_place_parent\"");
    await queryRunner.query("DROP INDEX \"place\".\"idx_place_located_in\"");
    await queryRunner.query("DROP INDEX \"place\".\"idx_place_kind_status\"");
    await queryRunner.query("DROP TABLE \"place\".\"places\"");
    await queryRunner.query("DROP TYPE \"place\".\"places_valid_to_precision_enum\"");
    await queryRunner.query("DROP TYPE \"place\".\"places_valid_from_precision_enum\"");
    await queryRunner.query("DROP TYPE \"place\".\"places_status_enum\"");
    await queryRunner.query("DROP TYPE \"place\".\"places_kind_enum\"");
    await queryRunner.query("DROP INDEX \"place\".\"idx_expectation_subject\"");
    await queryRunner.query("DROP INDEX \"place\".\"idx_expectation_scope\"");
    await queryRunner.query("DROP INDEX \"place\".\"idx_expectation_status\"");
    await queryRunner.query("DROP TABLE \"place\".\"expectations\"");
    await queryRunner.query("DROP TYPE \"place\".\"expectations_valid_to_precision_enum\"");
    await queryRunner.query("DROP TYPE \"place\".\"expectations_valid_from_precision_enum\"");
    await queryRunner.query("DROP TYPE \"place\".\"expectations_status_enum\"");
    await queryRunner.query("DROP TYPE \"place\".\"expectations_basis_enum\"");
    await queryRunner.query("DROP INDEX \"contact\".\"idx_contact_point_scope\"");
    await queryRunner.query("DROP TABLE \"contact\".\"points\"");
    await queryRunner.query("DROP TYPE \"contact\".\"points_visibility_enum\"");
    await queryRunner.query("DROP TYPE \"contact\".\"points_valid_to_precision_enum\"");
    await queryRunner.query("DROP TYPE \"contact\".\"points_valid_from_precision_enum\"");
    await queryRunner.query("DROP TYPE \"contact\".\"points_channel_enum\"");
  }
}
