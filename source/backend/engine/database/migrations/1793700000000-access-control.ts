import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Role-based access control that can grow into fine-grained RBAC.
 *
 * `access.permissions` is the catalogue of things an actor may do (code `area.action`), `access.roles`
 * bundles them, and `access.role_permissions` joins the two. An account's role still comes from
 * `identity.grants` (the four seeded roles); `access.account_permissions` resolves a grant to its
 * permissions, honouring the grant's validity and jurisdiction scope. Adding a role or permission is
 * a row, not a code change; guards check permission codes, never role names. The staging and engine
 * tables also gain updated_at and version so API entities can read them.
 */
export class AccessControl1793700000000 implements MigrationInterface {
  name = "AccessControl1793700000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS access`);
    await queryRunner.query(`CREATE TABLE access.roles (code text PRIMARY KEY, description text NOT NULL, built_in boolean NOT NULL DEFAULT true)`);
    await queryRunner.query(`CREATE TABLE access.permissions (code text PRIMARY KEY, description text NOT NULL)`);
    await queryRunner.query(`CREATE TABLE access.role_permissions (
      role_code text NOT NULL REFERENCES access.roles(code),
      permission_code text NOT NULL REFERENCES access.permissions(code),
      PRIMARY KEY (role_code, permission_code)
    )`);

    const roles: Record<string, string> = {
      reader: "Read public records.",
      contributor: "Add comments and evidence references.",
      reviewer: "Review staged candidates and the pipeline; draft assessments.",
      admin: "Everything a reviewer may do, plus promotion and approvals.",
    };
    const permissions: Record<string, string> = {
      "record.read": "Read published records.",
      "comment.create": "Add comments.",
      "evidence.create": "Attach evidence references.",
      "review.decide": "Record a review decision.",
      "pipeline.read": "Read staging candidates, runs, jobs, documents, captures and the site registry.",
      "assessment.draft": "Draft legal and source assessments.",
      "assessment.approve": "Approve a legal and source assessment (named human accounts only).",
      "candidate.promote": "Promote an approved candidate to a canonical record.",
      "access.manage": "Manage roles, permissions and grants.",
    };
    const bundles: Record<string, string[]> = {
      reader: ["record.read"],
      contributor: ["record.read", "comment.create", "evidence.create"],
      reviewer: ["record.read", "comment.create", "evidence.create", "review.decide", "pipeline.read", "assessment.draft"],
      admin: Object.keys(permissions),
    };
    for (const [code, description] of Object.entries(roles)) await queryRunner.query(`INSERT INTO access.roles (code, description) VALUES ($1, $2)`, [code, description]);
    for (const [code, description] of Object.entries(permissions)) await queryRunner.query(`INSERT INTO access.permissions (code, description) VALUES ($1, $2)`, [code, description]);
    for (const [role, codes] of Object.entries(bundles)) for (const code of codes) await queryRunner.query(`INSERT INTO access.role_permissions VALUES ($1, $2)`, [role, code]);

    await queryRunner.query(`CREATE VIEW access.account_permissions AS
      SELECT g.account_id, g.jurisdiction_id, rp.permission_code
      FROM identity.grants g
      JOIN identity.accounts a ON a.id = g.account_id AND a.status = 'active'
      JOIN access.role_permissions rp ON rp.role_code = g.role::text
      WHERE g.is_current AND (g.valid_from IS NULL OR g.valid_from <= current_date) AND (g.valid_to IS NULL OR g.valid_to >= current_date)`);

    await queryRunner.query(`CREATE FUNCTION access.touch() RETURNS trigger LANGUAGE plpgsql AS $$
      BEGIN NEW.updated_at := now(); NEW.version := OLD.version + 1; RETURN NEW; END $$`);
    for (const table of ["staging.runs", "staging.candidates", "staging.issues", "staging.promotions"]) {
      const name = table.replace(".", "_");
      await queryRunner.query(`ALTER TABLE ${table} ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now(), ADD COLUMN version integer NOT NULL DEFAULT 1`);
      await queryRunner.query(`CREATE TRIGGER touch_${name} BEFORE UPDATE ON ${table} FOR EACH ROW EXECUTE FUNCTION access.touch()`);
    }
    await queryRunner.query(`ALTER TABLE engine.jobs ADD COLUMN version integer NOT NULL DEFAULT 1`);
    await queryRunner.query(`CREATE TRIGGER touch_engine_jobs BEFORE UPDATE ON engine.jobs FOR EACH ROW EXECUTE FUNCTION access.touch()`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS touch_engine_jobs ON engine.jobs`);
    await queryRunner.query(`ALTER TABLE engine.jobs DROP COLUMN IF EXISTS version`);
    for (const table of ["staging.runs", "staging.candidates", "staging.issues", "staging.promotions"]) {
      await queryRunner.query(`DROP TRIGGER IF EXISTS touch_${table.replace(".", "_")} ON ${table}`);
      await queryRunner.query(`ALTER TABLE ${table} DROP COLUMN IF EXISTS updated_at, DROP COLUMN IF EXISTS version`);
    }
    await queryRunner.query(`DROP FUNCTION IF EXISTS access.touch()`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS access CASCADE`);
  }
}
