/**
 * Staging documents (MongoDB): what was captured, what was proposed from it and how review decided.
 *
 * Huge and messy by design; nothing here is trusted until a candidate is approved and promoted to PostgreSQL
 * through the change ledger. Raw bytes live in object storage; a capture records where.
 */
import * as dryv from "@dryvcode/author";
import { sharedProperties as p } from "#/schemas/_shared.ts";

export const staging = dryv
  .group({ name: "staging" })
  .description("Captured pages, proposed candidates and review state (Mongo).");

export const stagingEnums = staging.properties({
  CandidateKind: dryv.property.enum(["institution", "office", "holder", "mandate", "budget-line", "claim"]).tags("mongo"),
  CandidateStatus: dryv.property.enum(["proposed", "in-review", "approved", "rejected", "applied"]).tags("mongo"),
  ReviewDecision: dryv.property.enum(["approve", "reject", "defer"]).tags("mongo"),
});

export const stagingSchemas = staging.schemas({
  Capture: dryv
    .schema({
      id: dryv.field(p.Id),
      sourceId: dryv.field(p.Id),
      url: dryv.field(p.Url),
      httpStatus: dryv.field(p.HttpStatus).optional(),
      contentType: dryv.field(p.NullableString255).optional(),
      byteSize: dryv.field(p.NonNegativeInt64),
      sha256: dryv.field(p.Sha256),
      objectKey: dryv.field(p.NonEmptyString500),
      fetchedAt: dryv.field(p.Instant),
    })
    .tags("mongo"),
  Candidate: dryv
    .schema({
      id: dryv.field(p.Id),
      kind: dryv.field(stagingEnums.CandidateKind),
      status: dryv.field(stagingEnums.CandidateStatus),
      targetTable: dryv.field(p.NullableString255).optional(),
      payload: dryv.field(dryv.dynamic()),
      confidence: dryv.field(p.Confidence).optional(),
      captureIds: dryv.field(p.Id).array(),
      proposedBy: dryv.field(p.NonEmptyString255),
      createdAt: dryv.field(p.Instant),
      decidedAt: dryv.field(p.Instant).optional(),
      decidedBy: dryv.field(p.NullableString255).optional(),
      ledgerId: dryv.field(p.Id).optional(),
    })
    .tags("mongo"),
});
