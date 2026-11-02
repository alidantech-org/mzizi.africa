import type { DataSource, EntityManager } from "typeorm";

import { isReviewer, latestDecision } from "./review.ts";
import { resolvePayload, tableOf } from "./resolve.ts";
import { validatePayload } from "./validation.ts";

/**
 * Controlled promotion (DEC-DATA-ENGINE-DESIGN, item 6). The only writer of canonical rows and
 * verification state. One transaction per candidate writes the record (or a new version), its
 * attribution and verification, and the PromotionDecision; nothing is ever updated in place and
 * the audit tables are never touched.
 */
export interface PromotionResult {
  candidateId: string;
  outcome: "promoted" | "deferred";
  targetKind?: string;
  targetId?: string;
  previousTargetId?: string;
  reasons: string[];
}

const PACKAGE_TOOL = { tool: "engine-database", version: "0.1.0" };

interface CandidateRow {
  id: string;
  run_id: string;
  target_kind: string;
  payload: Record<string, unknown>;
  status: string;
  key_fields: string[];
  method: string;
  confidence: string | null;
  locator: unknown;
  segment_key: string | null;
}

async function methodId(tx: EntityManager, kind: string): Promise<string> {
  const found = await tx.query(`SELECT id FROM source.methods WHERE kind = $1 AND tool = $2 AND tool_version = $3 AND name = 'candidate promotion' LIMIT 1`, [kind, PACKAGE_TOOL.tool, PACKAGE_TOOL.version]);
  if (found[0]) return found[0].id;
  const [created] = await tx.query(`INSERT INTO source.methods (kind, name, tool, tool_version, created_at, updated_at, version) VALUES ($1, 'candidate promotion', $2, $3, now(), now(), 1) RETURNING id`, [kind, PACKAGE_TOOL.tool, PACKAGE_TOOL.version]);
  return created.id;
}

async function defer(db: DataSource, candidate: CandidateRow, reasons: string[], decisionId?: string): Promise<PromotionResult> {
  await db.query(`INSERT INTO staging.promotions (candidate_id, audit_decision_id, outcome, target_kind, verification_state, reasons) VALUES ($1, $2, 'deferred', $3, 'unverified', $4)`, [candidate.id, decisionId ?? null, candidate.target_kind, JSON.stringify(reasons)]);
  return { candidateId: candidate.id, outcome: "deferred", targetKind: candidate.target_kind, reasons };
}

export async function promoteCandidate(db: DataSource, candidateId: string): Promise<PromotionResult> {
  try {
    return await promoteInner(db, candidateId);
  } catch (cause) {
    if (!(cause instanceof DeferredError)) throw cause;
    const [candidate]: CandidateRow[] = await db.query(`SELECT * FROM staging.candidates WHERE id = $1`, [candidateId]);
    return defer(db, candidate!, cause.reasons, cause.decisionId);
  }
}

async function promoteInner(db: DataSource, candidateId: string): Promise<PromotionResult> {
  const [candidate]: CandidateRow[] = await db.query(`SELECT * FROM staging.candidates WHERE id = $1`, [candidateId]);
  if (!candidate) throw new Error(`unknown candidate ${candidateId}`);

  const done = await db.query(`SELECT target_kind, target_id, previous_target_id FROM staging.promotions WHERE candidate_id = $1 AND outcome = 'promoted'`, [candidateId]);
  if (done[0]) return { candidateId, outcome: "promoted", targetKind: done[0].target_kind, targetId: done[0].target_id, previousTargetId: done[0].previous_target_id ?? undefined, reasons: ["already promoted"] };

  if (candidate.status !== "approved") return defer(db, candidate, [`candidate status is ${candidate.status}; only approved candidates are promoted`]);

  const decision = await latestDecision(db, candidateId);
  if (!decision || decision.decision !== "approve") return defer(db, candidate, ["no approving review decision is the latest decision"], decision?.id);
  const jurisdiction = typeof candidate.payload.jurisdictionId === "string" ? candidate.payload.jurisdictionId : null;
  if (!(await isReviewer(db, decision.reviewer_id, jurisdiction))) return defer(db, candidate, ["the approving reviewer has no current reviewer or admin grant"], decision.id);

  // Provenance and the legal gate.
  const [capture] = await db.query(
    `SELECT c.id AS capture_id, c.document_id, c.site_id, d.licence FROM staging.runs r JOIN source.captures c ON c.id = r.capture_id JOIN source.documents d ON d.id = c.document_id WHERE r.id = $1`,
    [candidate.run_id],
  );
  const reasons: string[] = [];
  if (!capture) reasons.push("the candidate has no capture: preserved evidence is required");
  else {
    if (!capture.licence) reasons.push("the source document records no licence");
    if (capture.site_id) {
      const [assessment] = await db.query(`SELECT status, review_due_at FROM website.assessments WHERE site_id = $1 AND is_current LIMIT 1`, [capture.site_id]);
      if (!assessment || !["approved", "approved_with_conditions"].includes(assessment.status)) reasons.push(`the source's current legal status is ${assessment?.status ?? "not_reviewed"}`);
      else if (assessment.review_due_at && new Date(assessment.review_due_at) < new Date()) reasons.push("the source's legal review is overdue");
    }
  }
  if (reasons.length) return defer(db, candidate, reasons, decision.id);

  const meta = tableOf(db, candidate.target_kind);
  const { payload, errors } = await resolvePayload(db, candidate.payload);
  if (errors.length) return defer(db, candidate, errors.map((e) => `${e.field}: ${e.message}`), decision.id);
  const issues = (await validatePayload(db, candidate.target_kind, candidate.payload, candidate.key_fields)).filter((issue) => issue.severity === "error");
  if (issues.length) {
    await db.query(`UPDATE staging.candidates SET status = 'invalid' WHERE id = $1`, [candidateId]);
    return defer(db, candidate, issues.map((i) => `${i.rule}: ${i.message}`), decision.id);
  }

  const table = `"${meta.schema}"."${meta.tableName}"`;
  const column = (property: string) => {
    const found = meta.columns.find((c) => c.propertyName === property);
    if (!found) throw new Error(`${candidate.target_kind} has no field ${property}`);
    return `"${found.databaseName}"`;
  };
  const has = (property: string) => meta.columns.some((c) => c.propertyName === property);
  const state = ["verified", "under_review", "unverified"].includes(decision.proposed_state) ? decision.proposed_state : "unverified";

  return db.transaction(async (tx) => {
    // Existing current row for the natural key?
    const keyWhere = candidate.key_fields.map((f, i) => `${column(f)} = $${i + 1}`);
    if (has("isCurrent")) keyWhere.push(`"is_current" = true`);
    const existing: Array<Record<string, unknown>> = keyWhere.length ? await tx.query(`SELECT * FROM ${table} WHERE ${keyWhere.join(" AND ")} FOR UPDATE`, candidate.key_fields.map((f) => payload[f])) : [];
    if (existing.length > 1) return rollbackDefer(db, candidate, ["the natural key matches more than one current record"], decision.id);

    let targetId: string;
    let previousTargetId: string | undefined;
    let newRow = true;
    if (existing[0]) {
      const old = existing[0];
      const same = Object.entries(payload).every(([property, value]) => {
        const stored = old[meta.columns.find((c) => c.propertyName === property)!.databaseName];
        return String(stored instanceof Date ? stored.toISOString().slice(0, 10) : stored) === String(value) || (value === null && stored === null);
      });
      if (same) {
        targetId = String(old.id);
        newRow = false;
      } else {
        if (!has("isCurrent") || !(has("versionNumber") || has("validTo"))) return rollbackDefer(db, candidate, [`${candidate.target_kind} is not versioned: a changed record cannot replace the existing one in place`], decision.id);
        previousTargetId = String(old.id);
        await tx.query(`UPDATE ${table} SET "is_current" = false, "updated_at" = now()${has("validTo") ? `, "valid_to" = COALESCE("valid_to", current_date), "valid_to_precision" = COALESCE("valid_to_precision", 'exact')` : ""} WHERE id = $1`, [old.id]);
        targetId = await insertRow(tx, meta, payload, has("versionNumber") ? Number(old[meta.columns.find((c) => c.propertyName === "versionNumber")!.databaseName]) + 1 : undefined);
      }
    } else {
      targetId = await insertRow(tx, meta, payload, has("versionNumber") ? 1 : undefined);
    }

    const method = await methodId(tx, candidate.method);
    const have = await tx.query(`SELECT 1 FROM source.attributions WHERE target_kind = $1 AND target_id = $2 AND capture_id = $3 AND relation = 'supports'`, [candidate.target_kind, targetId, capture.capture_id]);
    if (have.length === 0) {
      await tx.query(
        `INSERT INTO source.attributions (document_id, capture_id, method_id, target_kind, target_id, relation, locator, confidence, attributed_by, created_at, updated_at, version) VALUES ($1, $2, $3, $4, $5, 'supports', $6, $7, $8, now(), now(), 1)`,
        [capture.document_id, capture.capture_id, method, candidate.target_kind, targetId, JSON.stringify({ ...(candidate.locator as object), segment: candidate.segment_key }).slice(0, 500), candidate.confidence, decision.reviewer_id],
      );
    }
    if (newRow) {
      await tx.query(`INSERT INTO source.verifications (target_kind, target_id, state, decision_id, decided_by, rationale, is_current, created_at, updated_at, version) VALUES ($1, $2, $3, $4, $5, $6, true, now(), now(), 1)`, [candidate.target_kind, targetId, state, decision.id, decision.reviewer_id, decision.rationale]);
    }
    if (previousTargetId) {
      await tx.query(`UPDATE source.verifications SET is_current = false, updated_at = now() WHERE target_kind = $1 AND target_id = $2 AND is_current`, [candidate.target_kind, previousTargetId]);
      await tx.query(`INSERT INTO source.verifications (target_kind, target_id, state, decision_id, decided_by, rationale, is_current, created_at, updated_at, version) VALUES ($1, $2, 'superseded', $3, $4, $5, true, now(), now(), 1)`, [candidate.target_kind, previousTargetId, decision.id, decision.reviewer_id, `superseded by ${targetId}`]);
    }
    await tx.query(`INSERT INTO staging.promotions (candidate_id, audit_decision_id, outcome, target_kind, target_id, previous_target_id, verification_state, reasons) VALUES ($1, $2, 'promoted', $3, $4, $5, $6, $7)`, [candidate.id, decision.id, candidate.target_kind, targetId, previousTargetId ?? null, newRow ? state : "unverified", JSON.stringify(newRow ? [] : ["identical record already canonical; attribution added"])]);
    await tx.query(`UPDATE staging.candidates SET status = 'promoted', resolved_target_id = $2 WHERE id = $1`, [candidate.id, targetId]);
    return { candidateId, outcome: "promoted" as const, targetKind: candidate.target_kind, targetId, previousTargetId, reasons: [] };
  });
}

async function rollbackDefer(db: DataSource, candidate: CandidateRow, reasons: string[], decisionId: string): Promise<never> {
  // Thrown out of the transaction so nothing partial is kept; the caller records the deferral afterwards.
  throw new DeferredError(reasons, decisionId);
}

export class DeferredError extends Error {
  constructor(readonly reasons: string[], readonly decisionId: string) {
    super(reasons.join("; "));
  }
}

async function insertRow(tx: EntityManager, meta: ReturnType<typeof tableOf>, payload: Record<string, unknown>, versionNumber?: number): Promise<string> {
  const values: Record<string, unknown> = { ...payload };
  const has = (property: string) => meta.columns.some((c) => c.propertyName === property);
  if (has("isCurrent") && values.isCurrent === undefined) values.isCurrent = true;
  if (versionNumber !== undefined && has("versionNumber") && values.versionNumber === undefined) values.versionNumber = versionNumber;
  values.version = 1;
  const properties = Object.keys(values).filter((property) => meta.columns.some((c) => c.propertyName === property));
  const columns = properties.map((property) => `"${meta.columns.find((c) => c.propertyName === property)!.databaseName}"`);
  const placeholders = properties.map((_, i) => `$${i + 1}`);
  const [row] = await tx.query(
    `INSERT INTO "${meta.schema}"."${meta.tableName}" (${columns.join(", ")}, "created_at", "updated_at") VALUES (${placeholders.join(", ")}, now(), now()) RETURNING id`,
    properties.map((property) => values[property]),
  );
  return row.id;
}

/** Promotes every approved candidate (of a run, in creation order). A failure of one never blocks the others. */
export async function promoteApproved(db: DataSource, runId?: string): Promise<PromotionResult[]> {
  const rows: Array<{ id: string }> = await db.query(`SELECT id FROM staging.candidates WHERE status = 'approved' AND ($1::uuid IS NULL OR run_id = $1) ORDER BY created_at`, [runId ?? null]);
  const results: PromotionResult[] = [];
  for (const row of rows) results.push(await promoteCandidate(db, row.id));
  return results;
}
