import type { MigrationInterface, QueryRunner } from "typeorm";

/** Generated from the Dryv entities by `bun run db generate`. Review before committing. */
export class ElectoralBallots1794800000000 implements MigrationInterface {
  name = "ElectoralBallots1794800000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("CREATE SCHEMA IF NOT EXISTS \"electoral\"");
    await queryRunner.query("CREATE TYPE \"electoral\".\"electorates_result_status_enum\" AS ENUM('declared', 'disputed', 'provisional', 'revised', 'set_aside')");
    await queryRunner.query("CREATE TYPE \"electoral\".\"electorates_valid_from_precision_enum\" AS ENUM('approximate', 'century', 'decade', 'exact', 'month', 'year')");
    await queryRunner.query("CREATE TYPE \"electoral\".\"electorates_valid_to_precision_enum\" AS ENUM('approximate', 'century', 'decade', 'exact', 'month', 'year')");
    await queryRunner.query("CREATE TABLE \"electoral\".\"electorates\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"created_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"declared_at\" TIMESTAMP WITH TIME ZONE, \"declaring_institution_id\" uuid, \"election_id\" uuid NOT NULL, \"evidence_form\" character varying(120), \"geo_unit_id\" uuid, \"is_current\" boolean NOT NULL, \"register_version\" character varying(200), \"registered_voters\" integer, \"rejected_votes\" integer, \"result_level_id\" uuid NOT NULL, \"result_status\" \"electoral\".\"electorates_result_status_enum\", \"seat_id\" uuid, \"spoilt_votes\" integer, \"updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"valid_from\" date, \"valid_from_precision\" \"electoral\".\"electorates_valid_from_precision_enum\", \"valid_to\" date, \"valid_to_precision\" \"electoral\".\"electorates_valid_to_precision_enum\", \"valid_votes\" integer, \"version\" integer NOT NULL, \"votes_cast\" integer, CONSTRAINT \"PK_496edd5fa55808913d2da39293c\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE INDEX \"idx_electorate_geo\" ON \"electoral\".\"electorates\" (\"geo_unit_id\") ");
    await queryRunner.query("CREATE INDEX \"idx_electorate_election\" ON \"electoral\".\"electorates\" (\"election_id\", \"result_level_id\") ");
    await queryRunner.query("CREATE TYPE \"electoral\".\"referendum_questions_valid_from_precision_enum\" AS ENUM('approximate', 'century', 'decade', 'exact', 'month', 'year')");
    await queryRunner.query("CREATE TYPE \"electoral\".\"referendum_questions_valid_to_precision_enum\" AS ENUM('approximate', 'century', 'decade', 'exact', 'month', 'year')");
    await queryRunner.query("CREATE TABLE \"electoral\".\"referendum_questions\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"code\" character varying(200) NOT NULL, \"created_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"election_id\" uuid NOT NULL, \"is_current\" boolean NOT NULL, \"position\" integer, \"text\" text NOT NULL, \"updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"valid_from\" date, \"valid_from_precision\" \"electoral\".\"referendum_questions_valid_from_precision_enum\", \"valid_to\" date, \"valid_to_precision\" \"electoral\".\"referendum_questions_valid_to_precision_enum\", \"version\" integer NOT NULL, CONSTRAINT \"PK_105c6aefec9ddbfb79b33b670ae\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE UNIQUE INDEX \"idx_referendum_question_code\" ON \"electoral\".\"referendum_questions\" (\"election_id\", \"code\") ");
    await queryRunner.query("CREATE TYPE \"electoral\".\"referendum_options_valid_from_precision_enum\" AS ENUM('approximate', 'century', 'decade', 'exact', 'month', 'year')");
    await queryRunner.query("CREATE TYPE \"electoral\".\"referendum_options_valid_to_precision_enum\" AS ENUM('approximate', 'century', 'decade', 'exact', 'month', 'year')");
    await queryRunner.query("CREATE TABLE \"electoral\".\"referendum_options\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"code\" character varying(200) NOT NULL, \"created_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"is_current\" boolean NOT NULL, \"label\" character varying(300) NOT NULL, \"position\" integer, \"question_id\" uuid NOT NULL, \"updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"valid_from\" date, \"valid_from_precision\" \"electoral\".\"referendum_options_valid_from_precision_enum\", \"valid_to\" date, \"valid_to_precision\" \"electoral\".\"referendum_options_valid_to_precision_enum\", \"version\" integer NOT NULL, CONSTRAINT \"PK_ce8852a2573d1a634981d35d5b8\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE UNIQUE INDEX \"idx_referendum_option_code\" ON \"electoral\".\"referendum_options\" (\"question_id\", \"code\") ");
    await queryRunner.query("CREATE TYPE \"electoral\".\"referendum_results_result_status_enum\" AS ENUM('declared', 'disputed', 'provisional', 'revised', 'set_aside')");
    await queryRunner.query("CREATE TYPE \"electoral\".\"referendum_results_valid_from_precision_enum\" AS ENUM('approximate', 'century', 'decade', 'exact', 'month', 'year')");
    await queryRunner.query("CREATE TYPE \"electoral\".\"referendum_results_valid_to_precision_enum\" AS ENUM('approximate', 'century', 'decade', 'exact', 'month', 'year')");
    await queryRunner.query("CREATE TABLE \"electoral\".\"referendum_results\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"created_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"declared_at\" TIMESTAMP WITH TIME ZONE, \"declaring_institution_id\" uuid, \"evidence_form\" character varying(120), \"geo_unit_id\" uuid, \"is_current\" boolean NOT NULL, \"option_id\" uuid NOT NULL, \"result_level_id\" uuid NOT NULL, \"result_status\" \"electoral\".\"referendum_results_result_status_enum\", \"updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"valid_from\" date, \"valid_from_precision\" \"electoral\".\"referendum_results_valid_from_precision_enum\", \"valid_to\" date, \"valid_to_precision\" \"electoral\".\"referendum_results_valid_to_precision_enum\", \"version\" integer NOT NULL, \"votes\" integer NOT NULL, CONSTRAINT \"PK_9ec763423265d1766cf2c41ad12\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE INDEX \"idx_referendum_result_geo\" ON \"electoral\".\"referendum_results\" (\"geo_unit_id\") ");
    await queryRunner.query("CREATE INDEX \"idx_referendum_result_option\" ON \"electoral\".\"referendum_results\" (\"option_id\", \"result_level_id\") ");
    await queryRunner.query("CREATE TYPE \"electoral\".\"seat_allocations_kind_enum\" AS ENUM('disability_special', 'nominated', 'other', 'party_list', 'women_special', 'workers_special', 'youth_special')");
    await queryRunner.query("CREATE TYPE \"electoral\".\"seat_allocations_valid_from_precision_enum\" AS ENUM('approximate', 'century', 'decade', 'exact', 'month', 'year')");
    await queryRunner.query("CREATE TYPE \"electoral\".\"seat_allocations_valid_to_precision_enum\" AS ENUM('approximate', 'century', 'decade', 'exact', 'month', 'year')");
    await queryRunner.query("CREATE TABLE \"electoral\".\"seat_allocations\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"allocated_on\" date, \"created_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"declaring_institution_id\" uuid, \"election_id\" uuid NOT NULL, \"geo_unit_id\" uuid, \"is_current\" boolean NOT NULL, \"kind\" \"electoral\".\"seat_allocations_kind_enum\" NOT NULL, \"list_position\" integer, \"party_id\" uuid NOT NULL, \"person_id\" uuid, \"seat_id\" uuid, \"seats_entitled\" integer, \"updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"valid_from\" date, \"valid_from_precision\" \"electoral\".\"seat_allocations_valid_from_precision_enum\", \"valid_to\" date, \"valid_to_precision\" \"electoral\".\"seat_allocations_valid_to_precision_enum\", \"version\" integer NOT NULL, CONSTRAINT \"PK_27c8e6bca82c372efa307b8cd53\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE INDEX \"idx_seat_allocation_party\" ON \"electoral\".\"seat_allocations\" (\"party_id\") ");
    await queryRunner.query("CREATE INDEX \"idx_seat_allocation_election\" ON \"electoral\".\"seat_allocations\" (\"election_id\", \"kind\") ");
    await queryRunner.query("ALTER TABLE \"electoral\".\"electorates\" ADD CONSTRAINT \"FK_95adeb286c2972cc949b0918973\" FOREIGN KEY (\"election_id\") REFERENCES \"electoral\".\"elections\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
    await queryRunner.query("ALTER TABLE \"electoral\".\"referendum_questions\" ADD CONSTRAINT \"FK_44ecdcf8dae2254004860036a5d\" FOREIGN KEY (\"election_id\") REFERENCES \"electoral\".\"elections\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
    await queryRunner.query("ALTER TABLE \"electoral\".\"referendum_options\" ADD CONSTRAINT \"FK_f6a1ed9d2d393983c9ba398ae13\" FOREIGN KEY (\"question_id\") REFERENCES \"electoral\".\"referendum_questions\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
    await queryRunner.query("ALTER TABLE \"electoral\".\"referendum_results\" ADD CONSTRAINT \"FK_ca99a760fa2c0bb50166f1a74f8\" FOREIGN KEY (\"option_id\") REFERENCES \"electoral\".\"referendum_options\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
    await queryRunner.query("ALTER TABLE \"electoral\".\"seat_allocations\" ADD CONSTRAINT \"FK_8ca3dc5ffbc6143e13a596ab79b\" FOREIGN KEY (\"election_id\") REFERENCES \"electoral\".\"elections\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE \"electoral\".\"seat_allocations\" DROP CONSTRAINT \"FK_8ca3dc5ffbc6143e13a596ab79b\"");
    await queryRunner.query("ALTER TABLE \"electoral\".\"referendum_results\" DROP CONSTRAINT \"FK_ca99a760fa2c0bb50166f1a74f8\"");
    await queryRunner.query("ALTER TABLE \"electoral\".\"referendum_options\" DROP CONSTRAINT \"FK_f6a1ed9d2d393983c9ba398ae13\"");
    await queryRunner.query("ALTER TABLE \"electoral\".\"referendum_questions\" DROP CONSTRAINT \"FK_44ecdcf8dae2254004860036a5d\"");
    await queryRunner.query("ALTER TABLE \"electoral\".\"electorates\" DROP CONSTRAINT \"FK_95adeb286c2972cc949b0918973\"");
    await queryRunner.query("DROP INDEX \"electoral\".\"idx_seat_allocation_election\"");
    await queryRunner.query("DROP INDEX \"electoral\".\"idx_seat_allocation_party\"");
    await queryRunner.query("DROP TABLE \"electoral\".\"seat_allocations\"");
    await queryRunner.query("DROP TYPE \"electoral\".\"seat_allocations_valid_to_precision_enum\"");
    await queryRunner.query("DROP TYPE \"electoral\".\"seat_allocations_valid_from_precision_enum\"");
    await queryRunner.query("DROP TYPE \"electoral\".\"seat_allocations_kind_enum\"");
    await queryRunner.query("DROP INDEX \"electoral\".\"idx_referendum_result_option\"");
    await queryRunner.query("DROP INDEX \"electoral\".\"idx_referendum_result_geo\"");
    await queryRunner.query("DROP TABLE \"electoral\".\"referendum_results\"");
    await queryRunner.query("DROP TYPE \"electoral\".\"referendum_results_valid_to_precision_enum\"");
    await queryRunner.query("DROP TYPE \"electoral\".\"referendum_results_valid_from_precision_enum\"");
    await queryRunner.query("DROP TYPE \"electoral\".\"referendum_results_result_status_enum\"");
    await queryRunner.query("DROP INDEX \"electoral\".\"idx_referendum_option_code\"");
    await queryRunner.query("DROP TABLE \"electoral\".\"referendum_options\"");
    await queryRunner.query("DROP TYPE \"electoral\".\"referendum_options_valid_to_precision_enum\"");
    await queryRunner.query("DROP TYPE \"electoral\".\"referendum_options_valid_from_precision_enum\"");
    await queryRunner.query("DROP INDEX \"electoral\".\"idx_referendum_question_code\"");
    await queryRunner.query("DROP TABLE \"electoral\".\"referendum_questions\"");
    await queryRunner.query("DROP TYPE \"electoral\".\"referendum_questions_valid_to_precision_enum\"");
    await queryRunner.query("DROP TYPE \"electoral\".\"referendum_questions_valid_from_precision_enum\"");
    await queryRunner.query("DROP INDEX \"electoral\".\"idx_electorate_election\"");
    await queryRunner.query("DROP INDEX \"electoral\".\"idx_electorate_geo\"");
    await queryRunner.query("DROP TABLE \"electoral\".\"electorates\"");
    await queryRunner.query("DROP TYPE \"electoral\".\"electorates_valid_to_precision_enum\"");
    await queryRunner.query("DROP TYPE \"electoral\".\"electorates_valid_from_precision_enum\"");
    await queryRunner.query("DROP TYPE \"electoral\".\"electorates_result_status_enum\"");
  }
}
