import type { DataSource } from "typeorm";

/** Reviewer authority: a current reviewer or admin grant, unscoped or scoped to the candidate's jurisdiction. */
export async function isReviewer(db: DataSource, accountId: string, jurisdictionId?: string | null): Promise<boolean> {
  const rows = await db.query(
    `SELECT 1 FROM identity.grants g JOIN identity.accounts a ON a.id = g.account_id
      WHERE g.account_id = $1 AND g.is_current AND a.status = 'active' AND g.role IN ('reviewer','admin')
        AND (g.valid_to IS NULL OR g.valid_to >= current_date) AND (g.jurisdiction_id IS NULL OR g.jurisdiction_id = $2) LIMIT 1`,
    [accountId, jurisdictionId ?? null],
  );
  return rows.length > 0;
}

export interface LatestDecision {
  id: string;
  decision: string;
  proposed_state: string;
  reviewer_id: string;
  rationale: string;
}

/** The newest review decision recorded through the API's audit write path for a staging candidate. */
export async function latestDecision(db: DataSource, candidateId: string): Promise<LatestDecision | undefined> {
  const rows = await db.query(
    `SELECT id, decision, proposed_state, reviewer_id, rationale FROM audit.decisions WHERE target_kind = 'staging.candidates' AND target_id = $1 ORDER BY created_at DESC, id DESC LIMIT 1`,
    [candidateId],
  );
  return rows[0];
}

/**
 * Moves candidates that are in review according to their newest decision: approve, then approved;
 * reject, then rejected; dispute or request_changes leave them in review with a warning issue. A
 * decision by an account without the reviewer role is ignored and reported.
 */
export async function applyReviewDecisions(db: DataSource): Promise<{ approved: number; rejected: number; held: number; ignored: number }> {
  const candidates: Array<{ id: string; payload: { jurisdictionId?: string } }> = await db.query(`SELECT id, payload FROM staging.candidates WHERE status = 'in_review'`);
  const tally = { approved: 0, rejected: 0, held: 0, ignored: 0 };
  for (const candidate of candidates) {
    const decision = await latestDecision(db, candidate.id);
    if (!decision) continue;
    const jurisdiction = typeof candidate.payload.jurisdictionId === "string" ? candidate.payload.jurisdictionId : null;
    if (!(await isReviewer(db, decision.reviewer_id, jurisdiction))) {
      tally.ignored++;
      await db.query(`INSERT INTO staging.issues (candidate_id, rule, severity, message) VALUES ($1, 'review', 'warning', $2)`, [candidate.id, `decision ${decision.id} was ignored: the reviewer has no current reviewer or admin grant`]);
      continue;
    }
    if (decision.decision === "approve") {
      await db.query(`UPDATE staging.candidates SET status = 'approved' WHERE id = $1`, [candidate.id]);
      tally.approved++;
    } else if (decision.decision === "reject") {
      await db.query(`UPDATE staging.candidates SET status = 'rejected' WHERE id = $1`, [candidate.id]);
      tally.rejected++;
    } else {
      await db.query(`INSERT INTO staging.issues (candidate_id, rule, severity, message) VALUES ($1, 'review', 'warning', $2)`, [candidate.id, `review decision ${decision.decision}: ${decision.rationale}`.slice(0, 500)]);
      tally.held++;
    }
  }
  return tally;
}
