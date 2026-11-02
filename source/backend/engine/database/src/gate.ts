import type { DataSource } from "typeorm";

/**
 * The collection gate (LEGALITY_SAFETY_AND_COMPLIANCE.md sections 8 and 9.3): decides whether a
 * request may be made, from the site's current legal/source assessment, and fails closed. It is
 * independent of structure validity and site health; a technically perfect structure is denied
 * when its assessment is missing, overdue, restricted or does not cover the request.
 */
export type LegalStatus = "not_reviewed" | "in_review" | "approved" | "approved_with_conditions" | "restricted" | "rejected" | "expired";

export interface GateRequest {
  siteId: string;
  host: string;
  scheme?: string;
  path: string;
  method?: string;
  fetchMode?: "http" | "api" | "browser";
  /** assess: bounded discovery or reachability; collect: extraction; publish: making content public. */
  purpose: "assess" | "collect" | "publish";
  requestsPerSecond?: number;
  now?: Date;
}

export interface AssessmentRecord {
  id: string;
  status: LegalStatus;
  jurisdictionId?: string | null;
  personalDataCategories: string;
  lawfulBasis?: string | null;
  approvedScope: string;
  conditions?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: Date | string | null;
  reviewDueAt?: Date | string | null;
}

export interface GateDecision {
  allowed: boolean;
  reasons: string[];
  assessmentId?: string;
  /** The most conservative limits that apply to an allowed request. */
  limits: { requestsPerSecond?: number };
}

interface Scope {
  hosts: string[];
  schemes?: string[];
  paths?: { allow?: string[]; deny?: string[] };
  fetchModes?: string[];
  maxRequestsPerSecond?: number;
  purposes?: string[];
}

/** Conditions the engine can enforce itself. An approval with any other kind of condition fails closed. */
const ENFORCEABLE = new Set(["max_requests_per_second", "no_publish", "attribution_required", "excluded_paths"]);

function parse<T>(text: string | null | undefined, label: string, reasons: string[]): T | undefined {
  if (text == null) return undefined;
  try {
    return JSON.parse(text) as T;
  } catch {
    reasons.push(`${label} is not valid JSON`);
    return undefined;
  }
}

const startsWithAny = (path: string, prefixes: string[]) => prefixes.some((prefix) => path.startsWith(prefix));

export function evaluate(assessment: AssessmentRecord | undefined, dossierStage: string | undefined, request: GateRequest): GateDecision {
  const deny = (...reasons: string[]): GateDecision => ({ allowed: false, reasons, assessmentId: assessment?.id, limits: {} });
  const now = request.now ?? new Date();
  const status: LegalStatus = assessment?.status ?? "not_reviewed";
  const overdue = assessment?.reviewDueAt != null && new Date(assessment.reviewDueAt) < now;
  const effective: LegalStatus = overdue && (status === "approved" || status === "approved_with_conditions") ? "expired" : status;

  if (request.purpose === "assess") {
    if (["not_reviewed", "in_review", "approved", "approved_with_conditions", "expired"].includes(effective)) {
      const method = (request.method ?? "GET").toUpperCase();
      if (method !== "GET" && method !== "HEAD") return deny("assessment requests are limited to GET and HEAD");
      return { allowed: true, reasons: [`bounded assessment under status ${effective}`], assessmentId: assessment?.id, limits: { requestsPerSecond: Math.min(request.requestsPerSecond ?? 0.5, 0.5) } };
    }
    return deny(`status ${effective} does not permit contact with the source`);
  }

  if (effective !== "approved" && effective !== "approved_with_conditions") return deny(effective === "expired" && overdue ? "the assessment review is overdue" : `legal status is ${effective}`);
  if (!assessment) return deny("no assessment");
  if (!assessment.reviewedBy || !assessment.reviewedAt) return deny("an approval must name an accountable human reviewer and a review date");

  const reasons: string[] = [];
  const scope = parse<Scope>(assessment.approvedScope, "approved scope", reasons);
  if (reasons.length || !scope || !Array.isArray(scope.hosts)) return deny(...reasons, "approved scope lists no hosts");

  if (!assessment.jurisdictionId) reasons.push("the assessment names no jurisdiction");
  else if (dossierStage !== "pilot" && dossierStage !== "production") reasons.push(`the jurisdiction dossier is at stage ${dossierStage ?? "missing"}, not pilot or production`);

  const categories = parse<string[]>(assessment.personalDataCategories, "personal data categories", reasons) ?? [];
  if (categories.some((category) => category !== "none_known") && !assessment.lawfulBasis) reasons.push("personal data is expected but no lawful basis is recorded");

  const scheme = request.scheme ?? "https";
  if (!scope.hosts.includes(request.host)) reasons.push(`host ${request.host} is outside the approved scope`);
  if (!(scope.schemes ?? ["https"]).includes(scheme)) reasons.push(`scheme ${scheme} is outside the approved scope`);
  if (scope.paths?.deny && startsWithAny(request.path, scope.paths.deny)) reasons.push(`path ${request.path} is denied`);
  if (scope.paths?.allow && !startsWithAny(request.path, scope.paths.allow)) reasons.push(`path ${request.path} is not in the allowed paths`);
  if (!(scope.fetchModes ?? ["http", "api"]).includes(request.fetchMode ?? "http")) reasons.push(`fetch mode ${request.fetchMode} is outside the approved scope`);
  if (scope.purposes && request.purpose === "publish" && !scope.purposes.includes("publish")) reasons.push("publication is outside the approved purposes");

  let maxRps = scope.maxRequestsPerSecond;
  const conditions = parse<Array<{ type: string; value?: unknown }>>(assessment.conditions, "conditions", reasons) ?? [];
  if (effective === "approved_with_conditions" && conditions.length === 0) reasons.push("approved with conditions but none are recorded");
  for (const condition of conditions) {
    if (!ENFORCEABLE.has(condition.type)) {
      reasons.push(`condition ${condition.type} cannot be enforced by the engine`);
      continue;
    }
    if (condition.type === "max_requests_per_second" && typeof condition.value === "number") maxRps = maxRps === undefined ? condition.value : Math.min(maxRps, condition.value);
    if (condition.type === "no_publish" && request.purpose === "publish") reasons.push("a condition forbids publication");
    if (condition.type === "excluded_paths" && Array.isArray(condition.value) && startsWithAny(request.path, condition.value as string[])) reasons.push(`path ${request.path} is excluded by a condition`);
  }
  if (maxRps !== undefined && request.requestsPerSecond !== undefined && request.requestsPerSecond > maxRps) reasons.push(`requested rate ${request.requestsPerSecond}/s exceeds the limit of ${maxRps}/s`);

  if (reasons.length) return deny(...reasons);
  return { allowed: true, reasons: [], assessmentId: assessment.id, limits: { requestsPerSecond: maxRps } };
}

/** Loads the current assessment and jurisdiction dossier from the database and evaluates the request. */
export async function checkCollection(db: DataSource, request: GateRequest): Promise<GateDecision> {
  const rows = await db.query(
    `SELECT id, status, jurisdiction_id AS "jurisdictionId", personal_data_categories AS "personalDataCategories", lawful_basis AS "lawfulBasis",
            approved_scope AS "approvedScope", conditions, reviewed_by AS "reviewedBy", reviewed_at AS "reviewedAt", review_due_at AS "reviewDueAt"
       FROM website.assessments WHERE site_id = $1 AND is_current ORDER BY created_at DESC LIMIT 2`,
    [request.siteId],
  );
  if (rows.length > 1) return { allowed: false, reasons: ["more than one current assessment exists for the site"], limits: {} };
  const assessment: AssessmentRecord | undefined = rows[0];
  let stage: string | undefined;
  if (assessment?.jurisdictionId) {
    const dossiers = await db.query(`SELECT launch_stage AS stage FROM website.dossiers WHERE jurisdiction_id = $1 AND is_current LIMIT 2`, [assessment.jurisdictionId]);
    stage = dossiers.length === 1 ? dossiers[0].stage : undefined;
  }
  return evaluate(assessment, stage, request);
}
