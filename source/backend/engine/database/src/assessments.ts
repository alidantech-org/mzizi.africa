import type { DataSource } from "typeorm";

/**
 * Decides a site's legal and source assessment (LEGALITY_SAFETY_AND_COMPLIANCE.md section 9).
 *
 * Assessments are append-only: a decision is a new row that supersedes the current one, so the history of
 * who approved what, and when, is never overwritten. Only a named human account holding the
 * `assessment.approve` permission may approve; an account whose issuer marks it as an agent or service
 * can never do it, however it was granted. Approval also needs a stated scope and a rationale.
 */
export type AssessmentOutcome = "approved" | "approved_with_conditions" | "restricted" | "rejected";
export const OUTCOMES: AssessmentOutcome[] = ["approved", "approved_with_conditions", "restricted", "rejected"];
const AGENT_ISSUER = /^(agent|service|bot|ai)/i;

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
    if (AGENT_ISSUER.test(actor.issuer)) throw new Error("agents and services may draft assessments but never decide them");
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
 * named human holding `assessment.approve` can. The drafter needs `assessment.draft`; a current assessment
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
