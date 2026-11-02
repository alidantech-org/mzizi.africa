import type { DataSource } from "typeorm";

import { readFixture } from "../../../api/src/neutral/fixture-loader.ts";

/**
 * Decides a site's legal and source assessment (LEGALITY_SAFETY_AND_COMPLIANCE.md section 9).
 *
 * Assessments are append-only: a decision is a new row that supersedes the current one, so the history of
 * who approved what, and when, is never overwritten. Only an active, named account (a person or an AI
 * agent) holding the
 * `assessment.approve` permission may approve; an account whose issuer marks it as an agent or service
 * can never do it, however it was granted. Approval also needs a stated scope and a rationale.
 */
export type AssessmentOutcome = "approved" | "approved_with_conditions" | "restricted" | "rejected";
export const OUTCOMES: AssessmentOutcome[] = ["approved", "approved_with_conditions", "restricted", "rejected"];

export interface AssessmentDecision {
  assessmentId: string;
  outcome: AssessmentOutcome;
  newAssessmentId: string;
}

export async function decideAssessment(db: DataSource, assessmentId: string, actorId: string, outcome: AssessmentOutcome): Promise<AssessmentDecision> {
  if (!OUTCOMES.includes(outcome)) throw new Error(`unknown outcome: ${outcome}`);
  return db.transaction(async (manager) => {
    const [actor] = await manager.query(`SELECT issuer FROM identity.accounts WHERE id = $1 AND status = 'active'`, [actorId]);
    if (!actor) throw new Error("the deciding account does not exist or is not active");
    const [allowed] = await manager.query(`SELECT 1 AS ok FROM access.account_permissions WHERE account_id = $1 AND permission_code = 'assessment.approve' LIMIT 1`, [actorId]);
    if (!allowed) throw new Error("the account does not hold assessment.approve");
    const [current] = await manager.query(`SELECT * FROM website.assessments WHERE id = $1 FOR UPDATE`, [assessmentId]);
    if (!current) throw new Error("assessment not found");
    if (!current.is_current) throw new Error("only the current assessment can be decided");
    if (outcome.startsWith("approved")) {
      const scope = typeof current.approved_scope === "string" ? current.approved_scope : JSON.stringify(current.approved_scope ?? "");
      if (scope.length < 5 || !current.rationale) throw new Error("approval needs an approved scope and a rationale");
    }
    const columns: { column_name: string }[] = await manager.query(
      `SELECT column_name FROM information_schema.columns WHERE table_schema = 'website' AND table_name = 'assessments' AND column_name NOT IN ('id','created_at','updated_at','version','status','is_current','reviewed_by','reviewed_at','supersedes_id') ORDER BY ordinal_position`,
    );
    const list = columns.map((column) => `"${column.column_name}"`).join(", ");
    const [created] = await manager.query(
      `INSERT INTO website.assessments (${list}, status, is_current, reviewed_by, reviewed_at, supersedes_id, created_at, updated_at, version)
       SELECT ${list}, $2::website.assessments_status_enum, true, $3, now(), id, now(), now(), 1 FROM website.assessments WHERE id = $1 RETURNING id`,
      [assessmentId, outcome, actorId],
    );
    await manager.query(`UPDATE website.assessments SET is_current = false, updated_at = now(), version = version + 1 WHERE id = $1`, [assessmentId]);
    return { assessmentId, outcome, newAssessmentId: created.id };
  });
}


export interface AssessmentDraft {
  siteId: string;
  accessBasis: string;
  sourceType: string;
  rightsHolder: string;
  approvedScope: string;
  rationale?: string;
  evidence?: string;
}

/**
 * Records a draft assessment as `in_review`. A draft never authorises collection: only a later decision by a
 * an account holding `assessment.approve` can, or the trusted-domain rule below. The drafter needs `assessment.draft`; a current assessment
 * for the site is superseded so there is one current row, and the history stays.
 */
export async function draftAssessment(db: DataSource, actorId: string, draft: AssessmentDraft): Promise<{ assessmentId: string }> {
  return db.transaction(async (manager) => {
    const [allowed] = await manager.query(`SELECT 1 AS ok FROM access.account_permissions WHERE account_id = $1 AND permission_code IN ('assessment.draft','assessment.approve') LIMIT 1`, [actorId]);
    if (!allowed) throw new Error("the account does not hold assessment.draft");
    if (!draft.approvedScope?.trim() || !draft.rightsHolder?.trim()) throw new Error("a draft needs a rights holder and an approved scope");
    const [site] = await manager.query(`SELECT id FROM website.sites WHERE id = $1`, [draft.siteId]);
    if (!site) throw new Error("site not found");
    const [current] = await manager.query(`SELECT id FROM website.assessments WHERE site_id = $1 AND is_current FOR UPDATE`, [draft.siteId]);
    const [created] = await manager.query(
      `INSERT INTO website.assessments (site_id, access_basis, source_type, rights_holder, approved_scope, rationale, evidence, personal_data_categories, status, is_current, supersedes_id, created_at, updated_at, version)
       VALUES ($1, $2::website.assessments_access_basis_enum, $3::website.assessments_source_type_enum, $4, $5, $6, $7, '[]', 'in_review', true, $8, now(), now(), 1) RETURNING id`,
      [draft.siteId, draft.accessBasis, draft.sourceType, draft.rightsHolder, draft.approvedScope, draft.rationale ?? null, draft.evidence ?? null, current?.id ?? null],
    );
    if (current) await manager.query(`UPDATE website.assessments SET is_current = false, updated_at = now(), version = version + 1 WHERE id = $1`, [current.id]);
    return { assessmentId: created.id };
  });
}


interface TrustedSuffix {
  suffix: string;
  jurisdiction: string;
  rightsHolder: string;
  maxRequestsPerSecond: number;
}

function trustedSuffixes(): TrustedSuffix[] {
  return (readFixture("policy/trusted-domains") as unknown as { suffixes: TrustedSuffix[] }).suffixes;
}

/**
 * Approves sites whose every domain falls under a trusted suffix (for example `.go.ke`), recording the rule as the
 * rationale and the acting account (a person or an AI agent) as the approver. The scope is bounded: https only,
 * plain HTTP fetching, the listed hosts and a low request rate; robots.txt is still respected by the fetcher.
 * Sites with any domain outside the trusted suffixes are left untouched. Re-running is safe.
 */
export async function autoAssess(db: DataSource, actorId: string): Promise<{ approved: string[]; skipped: string[] }> {
  const approved: string[] = [];
  const skipped: string[] = [];
  const rules = trustedSuffixes();
  const sites: { id: string; code: string; jurisdiction_id: string | null }[] = await db.query(`SELECT id, code, jurisdiction_id FROM website.sites ORDER BY code`);
  for (const site of sites) {
    const domains: { hostname: string }[] = await db.query(`SELECT hostname FROM website.domains WHERE site_id = $1`, [site.id]);
    const rule = domains.length ? rules.find((r) => domains.every((d) => d.hostname.endsWith(r.suffix))) : undefined;
    if (!rule) {
      skipped.push(site.code);
      continue;
    }
    const [existing] = await db.query(`SELECT status::text AS status FROM website.assessments WHERE site_id = $1 AND is_current`, [site.id]);
    if (existing && (existing.status === "approved" || existing.status === "restricted" || existing.status === "rejected")) {
      skipped.push(site.code);
      continue;
    }
    const [jurisdiction] = await db.query(`SELECT id FROM reference.jurisdictions WHERE code = $1`, [rule.jurisdiction]);
    const scope = JSON.stringify({ hosts: domains.map((d) => d.hostname), schemes: ["https"], fetchModes: ["http"], maxRequestsPerSecond: rule.maxRequestsPerSecond });
    const draft = await draftAssessment(db, actorId, {
      siteId: site.id,
      accessBasis: "published_terms",
      sourceType: "official_website",
      rightsHolder: rule.rightsHolder,
      approvedScope: scope,
      rationale: `Trusted domain rule: every domain of this site is under ${rule.suffix}; bounded, identified, robots-respecting collection of public pages only.`,
    });
    await db.query(`UPDATE website.assessments SET jurisdiction_id = $2, review_due_at = now() + interval '1 year' WHERE id = $1`, [draft.assessmentId, jurisdiction?.id ?? site.jurisdiction_id]);
    await decideAssessment(db, draft.assessmentId, actorId, "approved");
    approved.push(site.code);
  }
  return { approved, skipped };
}

/** Moves a jurisdiction's current dossier to a new launch stage, as a new row that supersedes the old one. */
export async function advanceDossier(db: DataSource, actorId: string, jurisdictionCode: string, stage: string): Promise<{ dossierId: string }> {
  return db.transaction(async (manager) => {
    const [allowed] = await manager.query(`SELECT 1 AS ok FROM access.account_permissions WHERE account_id = $1 AND permission_code = 'assessment.approve' LIMIT 1`, [actorId]);
    if (!allowed) throw new Error("the account does not hold assessment.approve");
    const [current] = await manager.query(`SELECT d.* FROM website.dossiers d JOIN reference.jurisdictions j ON j.id = d.jurisdiction_id WHERE j.code = $1 AND d.is_current FOR UPDATE OF d`, [jurisdictionCode]);
    if (!current) throw new Error(`no current dossier for ${jurisdictionCode}`);
    if (current.launch_stage === stage) return { dossierId: current.id };
    const [created] = await manager.query(
      `INSERT INTO website.dossiers (jurisdiction_id, applicable_laws, launch_stage, is_current, supersedes_id, reviewer_id, reviewed_at, open_questions, regulator, legislation_repository_url, treaty_status, review_due_at, created_at, updated_at, version)
       SELECT jurisdiction_id, applicable_laws, $2::website.dossiers_launch_stage_enum, true, id, $3, now(), open_questions, regulator, legislation_repository_url, treaty_status, now() + interval '1 year', now(), now(), 1 FROM website.dossiers WHERE id = $1 RETURNING id`,
      [current.id, stage, actorId],
    );
    await manager.query(`UPDATE website.dossiers SET is_current = false, updated_at = now(), version = version + 1 WHERE id = $1`, [current.id]);
    return { dossierId: created.id };
  });
}
