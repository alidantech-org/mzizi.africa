import * as dryv from "@dryvcode/author";

import { accessPolicies } from "../../foundation/shared/access.ts";
import { optionalId, plainId } from "../../foundation/shared/builders.ts";
import { readSurface, standardFailures, withStandardHttpFailures } from "../../foundation/shared/read-surface.ts";
import { baseEntitySchemas, sharedFailures, sharedProperties } from "../../foundation/shared/index.ts";

/**
 * The API's only writes: comments, evidence references and review decisions.
 *
 * All three are append-only records about another record (targetKind + targetId); corrections are
 * new records. None mutates canonical data: a review decision records a verdict and the verification
 * state it proposes, and applying that state to a canonical record is a reviewed step owned by the
 * database management engine. Actor identity and role come from the verified token, never the body.
 * Evidence points at a file in the filesystem schema (DEC-EVIDENCE-VIA-FILES).
 */
export const audit = dryv.group({ name: "audit" }).description("Comments, evidence references and review decisions about canonical records.").tags("public", "audit")
  .facets({ storage: { namespace: "audit" } });

export const auditProperties = audit.properties({
  Decision: dryv.property.enum({
    approve: "approve",
    reject: "reject",
    dispute: "dispute",
    requestChanges: "request_changes",
    supersede: "supersede",
  }),
});

function appendOnly(fields: Record<string, any>, table: string, indexes: Array<{ name: string; fields: string[] }>) {
  return dryv
    .schema(fields)
    .role("entity")
    .extends(baseEntitySchemas.BaseEntity)
    .facets({ storage: dryv.storage(table).indexes(...indexes) });
}

const actor = () => dryv.field(sharedProperties.Id).system().query({ filter: ["equal"] });
const target = {
  targetKind: dryv.field(sharedProperties.TargetKind).query({ filter: ["equal"] }),
  targetId: plainId(),
};

const records = audit.schemas({
  Comment: appendOnly(
    {
      ...target,
      parentCommentId: optionalId(),
      body: dryv.field(sharedProperties.LongText),
      actorId: actor(),
    },
    "comments",
    [{ name: "idx_comment_target", fields: ["targetKind", "targetId"] }],
  ),

  EvidenceReference: appendOnly(
    {
      ...target,
      // The evidence is a file in the filesystem schema; its hash, media type and size live there.
      fileId: plainId(),
      note: dryv.field(sharedProperties.Description).optional().nullable(),
      actorId: actor(),
    },
    "evidence",
    [{ name: "idx_evidence_target", fields: ["targetKind", "targetId"] }, { name: "idx_evidence_file", fields: ["fileId"] }],
  ),

  ReviewDecision: appendOnly(
    {
      ...target,
      decision: dryv.field(auditProperties.Decision).query({ filter: ["equal", "in"] }),
      proposedState: dryv.field(sharedProperties.VerificationState),
      rationale: dryv.field(sharedProperties.LongText),
      reviewerId: actor(),
    },
    "decisions",
    [{ name: "idx_decision_target", fields: ["targetKind", "targetId"] }],
  ),
});

const bodies = audit.schemas({
  CreateCommentBody: dryv.schema({
    ...target,
    parentCommentId: optionalId(),
    body: dryv.field(sharedProperties.LongText),
  }),
  CreateEvidenceReferenceBody: dryv.schema({
    ...target,
    fileId: plainId(),
    note: dryv.field(sharedProperties.Description).optional().nullable(),
  }),
  CreateReviewDecisionBody: dryv.schema({
    ...target,
    decision: dryv.field(auditProperties.Decision),
    proposedState: dryv.field(sharedProperties.VerificationState),
    rationale: dryv.field(sharedProperties.LongText),
  }),
});

const filters = { targetKind: dryv.field(sharedProperties.TargetKind).optional(), targetId: dryv.field(sharedProperties.Id).optional() };
const audited = audit.feature("Audit").description("Read and append comments, evidence references and review decisions.").tags("public");

const comments = readSurface(audit, { singular: "Comment", plural: "Comments", itemKey: "comment", listKey: "comments", path: "/audit/comments", idParam: "commentId", entity: records.Comment, description: "comments", filters });
const evidence = readSurface(audit, { singular: "EvidenceReference", plural: "EvidenceReferences", itemKey: "evidence", listKey: "evidenceReferences", path: "/audit/evidence", idParam: "evidenceId", entity: records.EvidenceReference, description: "evidence references", filters });
const decisions = readSurface(audit, { singular: "ReviewDecision", plural: "ReviewDecisions", itemKey: "decision", listKey: "decisions", path: "/audit/decisions", idParam: "decisionId", entity: records.ReviewDecision, description: "review decisions", filters });

function createOperation(description: string, path: string, body: any, response: any, policy: any) {
  const op = dryv
    .operation()
    .description(description)
    .input(body)
    .output(response)
    .failures(...standardFailures, sharedFailures.Unauthorized, sharedFailures.Forbidden)
    .authenticated()
    .requires(policy);
  op.facets({
    http: withStandardHttpFailures(dryv.http("POST", `/v1${path}`).description(description).input(op.in, dryv.body()).output(op.out, dryv.respond(201)))
      .failure(sharedFailures.Unauthorized, 401)
      .failure(sharedFailures.Forbidden, 403),
  });
  return op;
}

export const auditOperations = audited.operations({
  ...comments.operations,
  ...evidence.operations,
  ...decisions.operations,
  CreateComment: createOperation("Add a comment to a record.", "/audit/comments", bodies.CreateCommentBody, comments.responses.CommentResponse, accessPolicies.ContributorAccess),
  CreateEvidenceReference: createOperation("Attach an evidence reference (a file artifact held by the files service) to a record.", "/audit/evidence", bodies.CreateEvidenceReferenceBody, evidence.responses.EvidenceReferenceResponse, accessPolicies.ContributorAccess),
  CreateReviewDecision: createOperation("Record a review decision about a record.", "/audit/decisions", bodies.CreateReviewDecisionBody, decisions.responses.ReviewDecisionResponse, accessPolicies.ReviewerAccess),
});
