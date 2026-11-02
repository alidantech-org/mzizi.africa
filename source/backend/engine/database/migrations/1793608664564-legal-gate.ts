import type { MigrationInterface, QueryRunner } from "typeorm";

/** Generated from the Dryv entities by `bun run db generate`. Review before committing. */
export class LegalGate1793608664564 implements MigrationInterface {
  name = "LegalGate1793608664564";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("CREATE SCHEMA IF NOT EXISTS \"website\"");
    await queryRunner.query("CREATE SCHEMA IF NOT EXISTS \"source\"");
    await queryRunner.query("CREATE TYPE \"website\".\"assessments_access_basis_enum\" AS ENUM('access_to_information_response', 'open_endpoint', 'open_licence', 'other', 'published_terms', 'written_permission')");
    await queryRunner.query("CREATE TYPE \"website\".\"assessments_source_type_enum\" AS ENUM('api', 'document_repository', 'official_website', 'open_data_portal', 'other', 'third_party_repository')");
    await queryRunner.query("CREATE TYPE \"website\".\"assessments_status_enum\" AS ENUM('approved', 'approved_with_conditions', 'expired', 'in_review', 'not_reviewed', 'rejected', 'restricted')");
    await queryRunner.query("CREATE TABLE \"website\".\"assessments\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"access_basis\" \"website\".\"assessments_access_basis_enum\" NOT NULL, \"access_conditions\" text, \"approved_scope\" text NOT NULL, \"conditions\" text, \"created_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"evidence\" text, \"is_current\" boolean NOT NULL, \"jurisdiction_id\" uuid, \"lawful_basis\" character varying(4000), \"licence_name\" character varying(300), \"licence_url\" character varying(1000), \"licence_version\" character varying(300), \"personal_data_categories\" text NOT NULL, \"processing_purpose\" character varying(4000), \"rationale\" text, \"review_due_at\" TIMESTAMP WITH TIME ZONE, \"reviewed_at\" TIMESTAMP WITH TIME ZONE, \"reviewed_by\" uuid, \"rights_holder\" character varying(300) NOT NULL, \"site_id\" uuid NOT NULL, \"source_type\" \"website\".\"assessments_source_type_enum\" NOT NULL, \"status\" \"website\".\"assessments_status_enum\" NOT NULL, \"supersedes_id\" uuid, \"updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"version\" integer NOT NULL, CONSTRAINT \"PK_a3442bd80a00e9111cefca57f6c\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE INDEX \"idx_assessment_site_current\" ON \"website\".\"assessments\" (\"site_id\", \"is_current\") ");
    await queryRunner.query("CREATE TYPE \"website\".\"dossiers_launch_stage_enum\" AS ENUM('paused', 'pilot', 'production', 'research')");
    await queryRunner.query("CREATE TABLE \"website\".\"dossiers\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"applicable_laws\" text NOT NULL, \"created_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"is_current\" boolean NOT NULL, \"jurisdiction_id\" uuid NOT NULL, \"launch_stage\" \"website\".\"dossiers_launch_stage_enum\" NOT NULL, \"legislation_repository_url\" character varying(1000), \"open_questions\" text, \"regulator\" character varying(300), \"review_due_at\" TIMESTAMP WITH TIME ZONE, \"reviewed_at\" TIMESTAMP WITH TIME ZONE, \"reviewer_id\" uuid, \"supersedes_id\" uuid, \"treaty_status\" text, \"updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"version\" integer NOT NULL, CONSTRAINT \"PK_d84a24a9d2c52ec01142de45e42\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE INDEX \"idx_dossier_jurisdiction_current\" ON \"website\".\"dossiers\" (\"jurisdiction_id\", \"is_current\") ");
    await queryRunner.query("ALTER TABLE \"source\".\"captures\" ADD \"assessment_id\" uuid");
    await queryRunner.query("ALTER TABLE \"website\".\"assessments\" ADD CONSTRAINT \"FK_b05fea02ad287d9ac9e1bde1f29\" FOREIGN KEY (\"site_id\") REFERENCES \"website\".\"sites\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE \"website\".\"assessments\" DROP CONSTRAINT \"FK_b05fea02ad287d9ac9e1bde1f29\"");
    await queryRunner.query("ALTER TABLE \"source\".\"captures\" DROP COLUMN \"assessment_id\"");
    await queryRunner.query("DROP INDEX \"website\".\"idx_dossier_jurisdiction_current\"");
    await queryRunner.query("DROP TABLE \"website\".\"dossiers\"");
    await queryRunner.query("DROP TYPE \"website\".\"dossiers_launch_stage_enum\"");
    await queryRunner.query("DROP INDEX \"website\".\"idx_assessment_site_current\"");
    await queryRunner.query("DROP TABLE \"website\".\"assessments\"");
    await queryRunner.query("DROP TYPE \"website\".\"assessments_status_enum\"");
    await queryRunner.query("DROP TYPE \"website\".\"assessments_source_type_enum\"");
    await queryRunner.query("DROP TYPE \"website\".\"assessments_access_basis_enum\"");
  }
}
