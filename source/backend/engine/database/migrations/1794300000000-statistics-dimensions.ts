import type { MigrationInterface, QueryRunner } from "typeorm";

/** Generated from the Dryv entities by `bun run db generate`. Review before committing. */
export class StatisticsDimensions1794300000000 implements MigrationInterface {
  name = "StatisticsDimensions1794300000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("CREATE SCHEMA IF NOT EXISTS \"statistical\"");
    await queryRunner.query("CREATE TYPE \"statistical\".\"dimensions_valid_from_precision_enum\" AS ENUM('approximate', 'century', 'decade', 'exact', 'month', 'year')");
    await queryRunner.query("CREATE TYPE \"statistical\".\"dimensions_valid_to_precision_enum\" AS ENUM('approximate', 'century', 'decade', 'exact', 'month', 'year')");
    await queryRunner.query("CREATE TABLE \"statistical\".\"dimensions\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"code\" character varying(200) NOT NULL, \"description\" character varying(4000), \"name\" character varying(300) NOT NULL, \"created_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"is_current\" boolean NOT NULL, \"updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"valid_from\" date, \"valid_from_precision\" \"statistical\".\"dimensions_valid_from_precision_enum\", \"valid_to\" date, \"valid_to_precision\" \"statistical\".\"dimensions_valid_to_precision_enum\", \"version\" integer NOT NULL, CONSTRAINT \"PK_79693265d800ad0830d1ddddb41\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE UNIQUE INDEX \"idx_dimension_code\" ON \"statistical\".\"dimensions\" (\"code\") ");
    await queryRunner.query("CREATE TYPE \"statistical\".\"vintages_valid_from_precision_enum\" AS ENUM('approximate', 'century', 'decade', 'exact', 'month', 'year')");
    await queryRunner.query("CREATE TYPE \"statistical\".\"vintages_valid_to_precision_enum\" AS ENUM('approximate', 'century', 'decade', 'exact', 'month', 'year')");
    await queryRunner.query("CREATE TABLE \"statistical\".\"vintages\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"code\" character varying(200) NOT NULL, \"label\" character varying(200) NOT NULL, \"publisher_institution_id\" uuid, \"released_on\" date, \"supersedes_id\" uuid, \"created_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"is_current\" boolean NOT NULL, \"updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"valid_from\" date, \"valid_from_precision\" \"statistical\".\"vintages_valid_from_precision_enum\", \"valid_to\" date, \"valid_to_precision\" \"statistical\".\"vintages_valid_to_precision_enum\", \"version\" integer NOT NULL, CONSTRAINT \"PK_4a283c9972248b2b786b652edd7\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE UNIQUE INDEX \"idx_vintage_code\" ON \"statistical\".\"vintages\" (\"code\") ");
    await queryRunner.query("CREATE TYPE \"statistical\".\"dimension_members_valid_from_precision_enum\" AS ENUM('approximate', 'century', 'decade', 'exact', 'month', 'year')");
    await queryRunner.query("CREATE TYPE \"statistical\".\"dimension_members_valid_to_precision_enum\" AS ENUM('approximate', 'century', 'decade', 'exact', 'month', 'year')");
    await queryRunner.query("CREATE TABLE \"statistical\".\"dimension_members\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"code\" character varying(200) NOT NULL, \"dimension_id\" uuid NOT NULL, \"label\" character varying(300) NOT NULL, \"parent_id\" uuid, \"reference_code\" character varying(200), \"sort_order\" integer, \"created_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"is_current\" boolean NOT NULL, \"updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"valid_from\" date, \"valid_from_precision\" \"statistical\".\"dimension_members_valid_from_precision_enum\", \"valid_to\" date, \"valid_to_precision\" \"statistical\".\"dimension_members_valid_to_precision_enum\", \"version\" integer NOT NULL, CONSTRAINT \"PK_6f8738fd695355f8594ec1a9419\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE INDEX \"idx_dimension_member_parent\" ON \"statistical\".\"dimension_members\" (\"parent_id\") ");
    await queryRunner.query("CREATE UNIQUE INDEX \"idx_dimension_member_code\" ON \"statistical\".\"dimension_members\" (\"dimension_id\", \"code\") ");
    await queryRunner.query("CREATE TYPE \"statistical\".\"observation_dimensions_valid_from_precision_enum\" AS ENUM('approximate', 'century', 'decade', 'exact', 'month', 'year')");
    await queryRunner.query("CREATE TYPE \"statistical\".\"observation_dimensions_valid_to_precision_enum\" AS ENUM('approximate', 'century', 'decade', 'exact', 'month', 'year')");
    await queryRunner.query("CREATE TABLE \"statistical\".\"observation_dimensions\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"dimension_id\" uuid NOT NULL, \"member_id\" uuid NOT NULL, \"observation_id\" uuid NOT NULL, \"created_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"is_current\" boolean NOT NULL, \"updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"valid_from\" date, \"valid_from_precision\" \"statistical\".\"observation_dimensions_valid_from_precision_enum\", \"valid_to\" date, \"valid_to_precision\" \"statistical\".\"observation_dimensions_valid_to_precision_enum\", \"version\" integer NOT NULL, CONSTRAINT \"PK_d0a7893d426b1e1879aa385e1ef\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE INDEX \"idx_observation_dimension_member\" ON \"statistical\".\"observation_dimensions\" (\"member_id\") ");
    await queryRunner.query("CREATE UNIQUE INDEX \"idx_observation_dimension_unique\" ON \"statistical\".\"observation_dimensions\" (\"observation_id\", \"dimension_id\") ");
    await queryRunner.query("CREATE TYPE \"statistical\".\"observation_derivations_valid_from_precision_enum\" AS ENUM('approximate', 'century', 'decade', 'exact', 'month', 'year')");
    await queryRunner.query("CREATE TYPE \"statistical\".\"observation_derivations_valid_to_precision_enum\" AS ENUM('approximate', 'century', 'decade', 'exact', 'month', 'year')");
    await queryRunner.query("CREATE TABLE \"statistical\".\"observation_derivations\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"computation\" character varying(300) NOT NULL, \"input_observation_id\" uuid NOT NULL, \"input_role\" character varying(300), \"observation_id\" uuid NOT NULL, \"created_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"is_current\" boolean NOT NULL, \"updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"valid_from\" date, \"valid_from_precision\" \"statistical\".\"observation_derivations_valid_from_precision_enum\", \"valid_to\" date, \"valid_to_precision\" \"statistical\".\"observation_derivations_valid_to_precision_enum\", \"version\" integer NOT NULL, CONSTRAINT \"PK_6508991d5b2e5c3f16e763a8414\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE INDEX \"idx_observation_derivation_input\" ON \"statistical\".\"observation_derivations\" (\"input_observation_id\") ");
    await queryRunner.query("CREATE INDEX \"idx_observation_derivation_observation\" ON \"statistical\".\"observation_derivations\" (\"observation_id\") ");
    await queryRunner.query("ALTER TABLE \"statistical\".\"observations\" ADD \"denominator_value\" numeric(25,4)");
    await queryRunner.query("ALTER TABLE \"statistical\".\"observations\" ADD \"margin_of_error\" numeric(25,4)");
    await queryRunner.query("ALTER TABLE \"statistical\".\"observations\" ADD \"standard_error\" numeric(25,4)");
    await queryRunner.query("ALTER TABLE \"statistical\".\"observations\" ADD \"denominator_observation_id\" uuid");
    await queryRunner.query("CREATE TYPE \"statistical\".\"observations_estimate_kind_enum\" AS ENUM('administrative', 'census', 'derived', 'projection', 'survey')");
    await queryRunner.query("ALTER TABLE \"statistical\".\"observations\" ADD \"estimate_kind\" \"statistical\".\"observations_estimate_kind_enum\"");
    await queryRunner.query("CREATE TYPE \"statistical\".\"observations_measure_type_enum\" AS ENUM('count', 'index', 'mean', 'median', 'other', 'percentage', 'rate', 'ratio')");
    await queryRunner.query("ALTER TABLE \"statistical\".\"observations\" ADD \"measure_type\" \"statistical\".\"observations_measure_type_enum\"");
    await queryRunner.query("ALTER TABLE \"statistical\".\"observations\" ADD \"release_label\" character varying(200)");
    await queryRunner.query("ALTER TABLE \"statistical\".\"observations\" ADD \"vintage_id\" uuid");
    await queryRunner.query("CREATE INDEX \"idx_observation_vintage\" ON \"statistical\".\"observations\" (\"vintage_id\") ");
    await queryRunner.query("ALTER TABLE \"statistical\".\"dimension_members\" ADD CONSTRAINT \"FK_48df040e4d53c45733a73998c8e\" FOREIGN KEY (\"dimension_id\") REFERENCES \"statistical\".\"dimensions\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
    await queryRunner.query("ALTER TABLE \"statistical\".\"observation_dimensions\" ADD CONSTRAINT \"FK_a2aa8eac60a52e664881d3b66cb\" FOREIGN KEY (\"observation_id\") REFERENCES \"statistical\".\"observations\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
    await queryRunner.query("ALTER TABLE \"statistical\".\"observation_derivations\" ADD CONSTRAINT \"FK_4a06e8b19b704f1f6314b3eb684\" FOREIGN KEY (\"observation_id\") REFERENCES \"statistical\".\"observations\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE \"statistical\".\"observation_derivations\" DROP CONSTRAINT \"FK_4a06e8b19b704f1f6314b3eb684\"");
    await queryRunner.query("ALTER TABLE \"statistical\".\"observation_dimensions\" DROP CONSTRAINT \"FK_a2aa8eac60a52e664881d3b66cb\"");
    await queryRunner.query("ALTER TABLE \"statistical\".\"dimension_members\" DROP CONSTRAINT \"FK_48df040e4d53c45733a73998c8e\"");
    await queryRunner.query("DROP INDEX \"statistical\".\"idx_observation_vintage\"");
    await queryRunner.query("ALTER TABLE \"statistical\".\"observations\" DROP COLUMN \"vintage_id\"");
    await queryRunner.query("ALTER TABLE \"statistical\".\"observations\" DROP COLUMN \"release_label\"");
    await queryRunner.query("ALTER TABLE \"statistical\".\"observations\" DROP COLUMN \"measure_type\"");
    await queryRunner.query("DROP TYPE \"statistical\".\"observations_measure_type_enum\"");
    await queryRunner.query("ALTER TABLE \"statistical\".\"observations\" DROP COLUMN \"estimate_kind\"");
    await queryRunner.query("DROP TYPE \"statistical\".\"observations_estimate_kind_enum\"");
    await queryRunner.query("ALTER TABLE \"statistical\".\"observations\" DROP COLUMN \"denominator_observation_id\"");
    await queryRunner.query("ALTER TABLE \"statistical\".\"observations\" DROP COLUMN \"standard_error\"");
    await queryRunner.query("ALTER TABLE \"statistical\".\"observations\" DROP COLUMN \"margin_of_error\"");
    await queryRunner.query("ALTER TABLE \"statistical\".\"observations\" DROP COLUMN \"denominator_value\"");
    await queryRunner.query("DROP INDEX \"statistical\".\"idx_observation_derivation_observation\"");
    await queryRunner.query("DROP INDEX \"statistical\".\"idx_observation_derivation_input\"");
    await queryRunner.query("DROP TABLE \"statistical\".\"observation_derivations\"");
    await queryRunner.query("DROP TYPE \"statistical\".\"observation_derivations_valid_to_precision_enum\"");
    await queryRunner.query("DROP TYPE \"statistical\".\"observation_derivations_valid_from_precision_enum\"");
    await queryRunner.query("DROP INDEX \"statistical\".\"idx_observation_dimension_unique\"");
    await queryRunner.query("DROP INDEX \"statistical\".\"idx_observation_dimension_member\"");
    await queryRunner.query("DROP TABLE \"statistical\".\"observation_dimensions\"");
    await queryRunner.query("DROP TYPE \"statistical\".\"observation_dimensions_valid_to_precision_enum\"");
    await queryRunner.query("DROP TYPE \"statistical\".\"observation_dimensions_valid_from_precision_enum\"");
    await queryRunner.query("DROP INDEX \"statistical\".\"idx_dimension_member_code\"");
    await queryRunner.query("DROP INDEX \"statistical\".\"idx_dimension_member_parent\"");
    await queryRunner.query("DROP TABLE \"statistical\".\"dimension_members\"");
    await queryRunner.query("DROP TYPE \"statistical\".\"dimension_members_valid_to_precision_enum\"");
    await queryRunner.query("DROP TYPE \"statistical\".\"dimension_members_valid_from_precision_enum\"");
    await queryRunner.query("DROP INDEX \"statistical\".\"idx_vintage_code\"");
    await queryRunner.query("DROP TABLE \"statistical\".\"vintages\"");
    await queryRunner.query("DROP TYPE \"statistical\".\"vintages_valid_to_precision_enum\"");
    await queryRunner.query("DROP TYPE \"statistical\".\"vintages_valid_from_precision_enum\"");
    await queryRunner.query("DROP INDEX \"statistical\".\"idx_dimension_code\"");
    await queryRunner.query("DROP TABLE \"statistical\".\"dimensions\"");
    await queryRunner.query("DROP TYPE \"statistical\".\"dimensions_valid_to_precision_enum\"");
    await queryRunner.query("DROP TYPE \"statistical\".\"dimensions_valid_from_precision_enum\"");
  }
}
