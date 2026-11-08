import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Domain model. A domain is a first-class record with its own status, separate from the site it belongs to, so a
 * candidate hostname (from a pattern, seed research, a page link or a redirect) gets a row before any probe. Every
 * new column is nullable or defaulted because facts arrive late. `website.domain_zones` is the registry of zones in
 * use (.go.ke, .or.ke, ...); `website.dns_snapshots` is dated lookup history, appended and never overwritten.
 */
export class DomainModel1793900000000 implements MigrationInterface {
  name = "DomainModel1793900000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE website.domain_zones (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      suffix varchar(253) NOT NULL UNIQUE,
      parent_suffix varchar(253),
      operator text,
      purpose text,
      second_level_open boolean,
      source text,
      source_note text,
      created_at timestamptz NOT NULL,
      updated_at timestamptz NOT NULL,
      version integer NOT NULL
    )`);
    await queryRunner.query(`CREATE TYPE website.domains_status_enum AS ENUM ('candidate','reachable','redirects','moved','unreachable','refused','retired')`);
    await queryRunner.query(`CREATE TYPE website.domains_source_enum AS ENUM ('pattern','seed_research','page_link','redirect','manual')`);
    await queryRunner.query(`ALTER TABLE website.domains
      ADD COLUMN status website.domains_status_enum NOT NULL DEFAULT 'candidate',
      ADD COLUMN status_reason text,
      ADD COLUMN source website.domains_source_enum,
      ADD COLUMN source_note text,
      ADD COLUMN is_apex boolean,
      ADD COLUMN parent_domain_id uuid,
      ADD COLUMN zone_id uuid,
      ADD COLUMN last_probe_at timestamptz,
      ADD COLUMN last_http_status integer,
      ADD COLUMN redirect_to text`);
    await queryRunner.query(`CREATE INDEX idx_domain_status ON website.domains (status)`);
    await queryRunner.query(`CREATE INDEX idx_domain_zone ON website.domains (zone_id)`);
    await queryRunner.query(`CREATE TABLE website.dns_snapshots (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      domain_id uuid,
      zone_id uuid,
      record_type text NOT NULL,
      values text NOT NULL,
      resolver text,
      rcode text,
      observed_at timestamptz NOT NULL,
      created_at timestamptz NOT NULL
    )`);
    await queryRunner.query(`CREATE INDEX idx_dns_snapshot_domain ON website.dns_snapshots (domain_id, record_type, observed_at DESC)`);
    await queryRunner.query(`CREATE INDEX idx_dns_snapshot_zone ON website.dns_snapshots (zone_id, record_type, observed_at DESC)`);
    await queryRunner.query(`ALTER TABLE website.domains ADD CONSTRAINT "FK_0e45d14f775074a28e6b9498f59" FOREIGN KEY (parent_domain_id) REFERENCES website.domains(id)`);
    await queryRunner.query(`ALTER TABLE website.domains ADD CONSTRAINT "FK_2361d8208156dbfe3cc6e2c7627" FOREIGN KEY (zone_id) REFERENCES website.domain_zones(id)`);
    await queryRunner.query(`ALTER TABLE website.dns_snapshots ADD CONSTRAINT "FK_9d5a1bef67611c7e42c730dc471" FOREIGN KEY (domain_id) REFERENCES website.domains(id)`);
    await queryRunner.query(`ALTER TABLE website.dns_snapshots ADD CONSTRAINT "FK_982391c2725267ecb6561e98d54" FOREIGN KEY (zone_id) REFERENCES website.domain_zones(id)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS website.dns_snapshots`);
    await queryRunner.query(`ALTER TABLE website.domains DROP COLUMN IF EXISTS redirect_to, DROP COLUMN IF EXISTS last_http_status, DROP COLUMN IF EXISTS last_probe_at, DROP COLUMN IF EXISTS zone_id, DROP COLUMN IF EXISTS parent_domain_id, DROP COLUMN IF EXISTS is_apex, DROP COLUMN IF EXISTS source_note, DROP COLUMN IF EXISTS source, DROP COLUMN IF EXISTS status_reason, DROP COLUMN IF EXISTS status`);
    await queryRunner.query(`DROP TYPE IF EXISTS website.domains_source_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS website.domains_status_enum`);
    await queryRunner.query(`DROP TABLE IF EXISTS website.domain_zones`);
  }
}
