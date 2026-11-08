import type { MigrationInterface, QueryRunner } from "typeorm";

/** Crawled documents (TSK-C6D4EC067F97) and document semantics (TSK-C6EB48738A4D): section visits, document sightings, document classifications. Generated from the Dryv entities, trimmed to these three tables. */
export class DocumentCrawlAndSemantics1795000000007 implements MigrationInterface {
  name = "DocumentCrawlAndSemantics1795000000007";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("CREATE SCHEMA IF NOT EXISTS \"website\"");
    await queryRunner.query("CREATE SCHEMA IF NOT EXISTS \"source\"");
    await queryRunner.query("CREATE TABLE \"website\".\"document_sightings\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"capture_id\" uuid, \"content_hash\" character varying(64) NOT NULL, \"created_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"depth\" integer NOT NULL, \"document_id\" uuid NOT NULL, \"headers\" text, \"http_status\" integer NOT NULL, \"page_url\" character varying(1000), \"rule_index\" integer, \"section_label\" character varying(60), \"seen_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"site_id\" uuid NOT NULL, \"size_bytes\" bigint NOT NULL, \"structure_version_id\" uuid, \"updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"url\" character varying(1000) NOT NULL, \"version\" integer NOT NULL, CONSTRAINT \"PK_20536b128f58b7ca0d34670551a\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE INDEX \"idx_sighting_document\" ON \"website\".\"document_sightings\" (\"document_id\") ");
    await queryRunner.query("CREATE UNIQUE INDEX \"idx_sighting_url_hash\" ON \"website\".\"document_sightings\" (\"url\", \"content_hash\") ");
    await queryRunner.query("CREATE TABLE \"website\".\"section_visits\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"created_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"depth\" integer NOT NULL, \"items_found\" integer NOT NULL, \"page_url\" character varying(1000), \"rule_index\" integer, \"section_label\" character varying(60) NOT NULL, \"site_id\" uuid NOT NULL, \"structure_version_id\" uuid, \"updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"version\" integer NOT NULL, \"visited_at\" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT \"PK_89b3a55aa9ed245438d8be2c8cd\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE INDEX \"idx_sectionvisit_site_section\" ON \"website\".\"section_visits\" (\"site_id\", \"section_label\", \"visited_at\") ");
    await queryRunner.query("CREATE TYPE \"source\".\"document_classifications_method_enum\" AS ENUM('none', 'text_pattern', 'title_fuzzy', 'url_pattern')");
    await queryRunner.query("CREATE TYPE \"source\".\"document_classifications_route_status_enum\" AS ENUM('gapped', 'routed', 'unrouted')");
    await queryRunner.query("CREATE TABLE \"source\".\"document_classifications\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"classified_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"classifier_version\" character varying(200) NOT NULL, \"created_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"document_id\" uuid NOT NULL, \"evidence\" text, \"facts\" text, \"kind\" character varying(60) NOT NULL, \"method\" \"source\".\"document_classifications_method_enum\" NOT NULL, \"route_parser\" character varying(200), \"route_status\" \"source\".\"document_classifications_route_status_enum\" NOT NULL, \"score\" double precision NOT NULL, \"updated_at\" TIMESTAMP WITH TIME ZONE NOT NULL, \"version\" integer NOT NULL, CONSTRAINT \"PK_5cd40cd7c1fa388631cf75406bd\" PRIMARY KEY (\"id\"))");
    await queryRunner.query("CREATE INDEX \"idx_docclass_kind\" ON \"source\".\"document_classifications\" (\"kind\") ");
    await queryRunner.query("CREATE UNIQUE INDEX \"idx_docclass_document_version\" ON \"source\".\"document_classifications\" (\"document_id\", \"classifier_version\") ");
    await queryRunner.query("ALTER TABLE \"website\".\"document_sightings\" ADD CONSTRAINT \"FK_03816f1ea8a238ebdccfbba6b5e\" FOREIGN KEY (\"site_id\") REFERENCES \"website\".\"sites\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
    await queryRunner.query("ALTER TABLE \"website\".\"section_visits\" ADD CONSTRAINT \"FK_7049ecc22c05b01cb2254565d64\" FOREIGN KEY (\"site_id\") REFERENCES \"website\".\"sites\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE \"website\".\"section_visits\" DROP CONSTRAINT \"FK_7049ecc22c05b01cb2254565d64\"");
    await queryRunner.query("ALTER TABLE \"website\".\"document_sightings\" DROP CONSTRAINT \"FK_03816f1ea8a238ebdccfbba6b5e\"");
    await queryRunner.query("DROP INDEX \"source\".\"idx_docclass_document_version\"");
    await queryRunner.query("DROP INDEX \"source\".\"idx_docclass_kind\"");
    await queryRunner.query("DROP TABLE \"source\".\"document_classifications\"");
    await queryRunner.query("DROP TYPE \"source\".\"document_classifications_route_status_enum\"");
    await queryRunner.query("DROP TYPE \"source\".\"document_classifications_method_enum\"");
    await queryRunner.query("DROP INDEX \"website\".\"idx_sectionvisit_site_section\"");
    await queryRunner.query("DROP TABLE \"website\".\"section_visits\"");
    await queryRunner.query("DROP INDEX \"website\".\"idx_sighting_url_hash\"");
    await queryRunner.query("DROP INDEX \"website\".\"idx_sighting_document\"");
    await queryRunner.query("DROP TABLE \"website\".\"document_sightings\"");
  }
}
