import type { DataSource } from "typeorm";

/**
 * Claim review and promotion (DEC-CLAIMS-AND-CONFLICTS, TSK-D16F9399E4B6). The data engine proposes claims
 * (`engine.claims`, one value one source asserts for one field of one record) and derives the standing per field
 * (`engine.claim_standings`: winner, corroboration, dispute flag). This module is the controlled path from a winner
 * into the data table:
 *
 *   validate  a proposed claim is checked against the field's rules (format, existing target, promotable field);
 *   review    an accountable account (a person or an AI agent holding `review.decide`) accepts or rejects it, with a
 *             rationale recorded as an `audit.decisions` row; only the standing winner of an undisputed field is accepted
 *             automatically, a disputed field is left for a reviewer;
 *   promote   an accepted winner fills the column in place. Only annotation fields that never need history are
 *             promotable (identifiers, existence markers, descriptions); a column that already holds a different value is
 *             never overwritten: the claim stays accepted, the promotion is reported as a conflict and the field stays disputed.
 */
export const PROMOTABLE: Record<string, Record<string, (value: unknown) => string | null>> = {
  "geography.units": { wikidata_id: wikidata, flag_marker: marker, emblem_marker: marker },
  "political.parties": { wikidata_id: wikidata, logo_marker: marker, abbreviation: text(40) },
  "governance.institutions": { wikidata_id: wikidata, logo_marker: marker, description: text(4000) },
  "person.individuals": { wikidata_id: wikidata, portrait_marker: marker },
};

function wikidata(value: unknown): string | null {
  return typeof value === "string" && /^Q[1-9]\d{0,12}$/.test(value) ? null : `${JSON.stringify(value)} is not a Wikidata item identifier`;
}
function marker(value: unknown): string | null {
  return value === "has" || value === "none" ? null : `${JSON.stringify(value)} is not a decided marker (has or none)`;
}
function text(max: number) {
  return (value: unknown): string | null => (typeof value === "string" && value.trim().length > 0 && value.length <= max ? null : `a non-empty string of at most ${max} characters is required`);
}

const UNSET = (column: string) => (column.endsWith("_marker") ? `(t."${column}" IS NULL OR t."${column}"::text = 'unknown')` : `t."${column}" IS NULL`);

interface ClaimRow {
  id: string;
  target_kind: string;
  target_id: string;
  field: string;
  value: unknown;
  trust: string;
  review: string;
}

export function checkClaim(claim: Pick<ClaimRow, "target_kind" | "field" | "value">): string | null {
  const rule = PROMOTABLE[claim.target_kind]?.[claim.field];
  return rule ? rule(claim.value) : `${claim.target_kind}.${claim.field} is not a promotable field`;
}

export interface ReviewTally {
  accepted: number;
  rejected: number;
  left: number;
}

/**
 * Reviews proposed claims. Rejects the invalid; accepts those that are the winner of their standing, undisputed and at
 * least `minTrust`; leaves the rest (disputed, outranked, low trust) for a human or a later pass.
 */
export async function reviewClaims(db: DataSource, actorId: string, rationale: string, options: { minTrust?: number; fields?: string[] } = {}): Promise<ReviewTally> {
  const [allowed] = await db.query(`SELECT 1 AS ok FROM access.account_permissions WHERE account_id = $1 AND permission_code = 'review.decide' LIMIT 1`, [actorId]);
  if (!allowed) throw new Error("the account does not hold review.decide");
  if (!rationale.trim()) throw new Error("a rationale is required");
  const minTrust = options.minTrust ?? 0.5;
  const claims: Array<ClaimRow & { winner: string | null; disputed: boolean | null }> = await db.query(
    `SELECT c.id, c.target_kind, c.target_id, c.field, c.value, c.trust, c.review, s.winning_claim_id AS winner, s.disputed
       FROM engine.claims c LEFT JOIN engine.claim_standings s ON s.target_kind = c.target_kind AND s.target_id = c.target_id AND s.field = c.field
      WHERE c.review = 'proposed' AND ($1::text[] IS NULL OR c.field = ANY($1)) ORDER BY c.created_at`,
    [options.fields ?? null],
  );
  const tally: ReviewTally = { accepted: 0, rejected: 0, left: 0 };
  for (const claim of claims) {
    const problem = checkClaim(claim);
    const [target] = PROMOTABLE[claim.target_kind] ? await db.query(`SELECT 1 AS ok FROM ${claim.target_kind} WHERE id = $1`, [claim.target_id]) : [];
    let decision: "approve" | "reject" | null = null;
    let why = rationale;
    if (problem || !target) {
      decision = "reject";
      why = `${rationale} Rejected: ${problem ?? "the target record does not exist"}.`;
    } else if (claim.winner === claim.id && !claim.disputed && Number(claim.trust) >= minTrust) {
      decision = "approve";
    }
    if (!decision) {
      tally.left++;
      continue;
    }
    await db.query(
      `INSERT INTO audit.decisions (target_kind, target_id, decision, proposed_state, rationale, reviewer_id, created_at, updated_at, version) VALUES ('engine.claims', $1, $2, 'unverified', $3, $4, now(), now(), 1)`,
      [claim.id, decision, why, actorId],
    );
    await db.query(`UPDATE engine.claims SET review = $2, reviewed_by = $3, reviewed_at = now(), review_rationale = $4 WHERE id = $1`, [claim.id, decision === "approve" ? "accepted" : "rejected", actorId, why]);
    // A rejected claim no longer counts: drop a standing it won; the data engine recomputes it (reinforcement.rebuild_all_standings).
    if (decision === "reject") await db.query(`DELETE FROM engine.claim_standings WHERE winning_claim_id = $1`, [claim.id]);
    tally[decision === "approve" ? "accepted" : "rejected"]++;
  }
  return tally;
}

export interface PromotionTally {
  promoted: number;
  already: number;
  conflicts: Array<{ claimId: string; kind: string; field: string; existing: unknown; claimed: unknown }>;
}

/** Promotes accepted claims that are the winner of their field: fills an unset column in place, never overwrites a different value. */
export async function promoteClaims(db: DataSource): Promise<PromotionTally> {
  const tally: PromotionTally = { promoted: 0, already: 0, conflicts: [] };
  const claims: ClaimRow[] = await db.query(
    `SELECT c.id, c.target_kind, c.target_id, c.field, c.value, c.trust, c.review FROM engine.claims c
       JOIN engine.claim_standings s ON s.winning_claim_id = c.id WHERE c.review = 'accepted' AND c.promoted_at IS NULL ORDER BY c.reviewed_at`,
  );
  for (const claim of claims) {
    if (checkClaim(claim)) continue;
    const column = claim.field;
    const [current] = await db.query(`SELECT t."${column}"::text AS v FROM ${claim.target_kind} t WHERE t.id = $1`, [claim.target_id]);
    if (!current) continue;
    const claimed = String(claim.value);
    if (current.v === claimed) {
      tally.already++;
    } else if (current.v === null || (column.endsWith("_marker") && current.v === "unknown")) {
      const updated = await db.query(`UPDATE ${claim.target_kind} t SET "${column}" = $2, updated_at = now() WHERE t.id = $1 AND ${UNSET(column)} RETURNING t.id`, [claim.target_id, claimed]);
      if (!updated.length) continue;
      tally.promoted++;
    } else {
      tally.conflicts.push({ claimId: claim.id, kind: claim.target_kind, field: column, existing: current.v, claimed: claim.value });
      continue;
    }
    await db.query(`UPDATE engine.claims SET promoted_at = now() WHERE id = $1`, [claim.id]);
    await db.query(`UPDATE engine.gaps SET status = 'found', updated_at = now() WHERE target_kind = $1 AND target_id = $2 AND field = $3 AND status <> 'known_absent'`, [claim.target_kind, claim.target_id, column]);
  }
  return tally;
}
