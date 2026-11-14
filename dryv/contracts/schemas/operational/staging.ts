/**
 * Schema: staging | Database: mzizi_operations
 * Approval: DEC-OPERATIONAL-DATABASE-20261112 (accepted, 2026-11-12); table and column inventory is unchanged.
 * Design: .docs/_plan/schema-redesign/mzizi-operational-db/staging.md
 */
import * as dryv from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { Artifacts, Runs } from "./engine.ts";
import { Accounts } from "./auth.ts";
import { Publications } from "./management.ts";

const belongsTo = dryv.belongsToUsing(sharedProperties.Id);

export const staging = dryv
  .group({ name: "staging" })
  .description("Candidate revisions, mappings, validation findings and review workflow.")
  .facets({ storage: { namespace: "staging", store: "operations" } });

/*---------------- Closed technical vocabulary ----------------*/
export const stagingEnums = staging.properties({
  CandidateStatus: dryv.property.enum(["pending", "in_review", "accepted", "rejected", "promoted", "superseded"]),
  MappingStatus: dryv.property.enum(["draft", "active", "retired"]),
  PromotionStatus: dryv.property.enum([
    "pending",
    "submitted",
    "succeeded",
    "failed",
    "rejected",
    "reconciliation_required",
  ]),
  StagingSeverity: dryv.property.enum(["info", "warning", "error", "critical"]),
  StagingDecision: dryv.property.enum(["approve", "reject", "request_changes"]),
});

export const Candidates = staging
  .schema("Candidates", {
    targetSchema: dryv.field(sharedProperties.NonEmptyString100),
    targetTable: dryv.field(sharedProperties.NonEmptyString100),
    targetContract: dryv.field(sharedProperties.NonEmptyString255),
    targetContractVersion: dryv.field(sharedProperties.NonEmptyString255),
    stableKey: dryv.field(sharedProperties.String500).maybe(),
    sourceRunId: belongsTo(() => Runs).maybe(),
    status: dryv.field(stagingEnums.CandidateStatus),
    currentRevisionId: belongsTo(() => Revisions).maybe(),
    createdBy: belongsTo(() => Accounts),
  })
  .extends(baseSchemas.Created)
  .description("Proposed record awaiting review; never canonical until accepted and published.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("candidates")
      .index("sourceRunId")
      .index("createdBy")
      .index("currentRevisionId")
      .index("status", "createdAt"),
  });

export const Revisions = staging
  .schema("Revisions", {
    candidateId: belongsTo(() => Candidates).createOnly(),
    revisionNumber: dryv.field(sharedProperties.PositiveInteger).createOnly(),
    payload: dryv.field(sharedProperties.JsonText).createOnly(),
    schemaVersion: dryv.field(sharedProperties.NonEmptyString100).createOnly(),
    contentHash: dryv.field(sharedProperties.Sha256).createOnly(),
    artifactId: belongsTo(() => Artifacts)
      .maybe()
      .createOnly(),
    sourceManifestKey: dryv.field(sharedProperties.String1000).maybe().createOnly(),
    sourceManifestHash: dryv.field(sharedProperties.Sha256).maybe().createOnly(),
    createdBy: belongsTo(() => Accounts).createOnly(),
    createdAt: dryv.field(sharedProperties.Instant).createOnly(),
    supersedesRevisionId: belongsTo(dryv.self).maybe().createOnly(),
  })
  .extends(baseSchemas.Immutable)
  .description("Append-only revision of a candidate's proposed content.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("revisions")
      .index("createdBy")
      .index("supersedesRevisionId")
      .unique("candidateId", "revisionNumber"),
  });

export const Mappings = staging
  .schema("Mappings", {
    sourceKind: dryv.field(sharedProperties.NonEmptyString100),
    targetContract: dryv.field(sharedProperties.NonEmptyString255),
    targetContractVersion: dryv.field(sharedProperties.NonEmptyString255),
    version: dryv.field(sharedProperties.PositiveInteger),
    mappingDefinition: dryv.field(sharedProperties.JsonText),
    mappingHash: dryv.field(sharedProperties.Sha256),
    modelProvider: dryv.field(sharedProperties.String255).maybe(),
    modelName: dryv.field(sharedProperties.String255).maybe(),
    modelVersion: dryv.field(sharedProperties.String255).maybe(),
    status: dryv.field(stagingEnums.MappingStatus),
    createdBy: belongsTo(() => Accounts),
    approvedBy: belongsTo(() => Accounts).maybe(),
    approvedAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.Created)
  .description("Mapping from extracted fields to the candidate's target record.")
  .role("entity")
  .facets({
    storage: dryv.storage("mappings").index("createdBy").index("approvedBy"),
  });

export const Findings = staging
  .schema("Findings", {
    revisionId: belongsTo(() => Revisions).createOnly(),
    path: dryv.field(sharedProperties.NonEmptyString1000).createOnly(),
    code: dryv.field(sharedProperties.IdentityCode).createOnly(),
    severity: dryv.field(stagingEnums.StagingSeverity).createOnly(),
    message: dryv.field(sharedProperties.NonEmptyString1000).createOnly(),
    details: dryv.field(sharedProperties.JsonText).maybe().createOnly(),
    ruleVersion: dryv.field(sharedProperties.NonEmptyString255).createOnly(),
    createdAt: dryv.field(sharedProperties.Instant).createOnly(),
  })
  .extends(baseSchemas.Immutable)
  .description("Append-only validation finding raised against a revision.")
  .role("entity")
  .facets({
    storage: dryv.storage("findings").index("revisionId"),
  });

export const Reviews = staging
  .schema("Reviews", {
    revisionId: belongsTo(() => Revisions).createOnly(),
    reviewerId: belongsTo(() => Accounts).createOnly(),
    decision: dryv.field(stagingEnums.StagingDecision).createOnly(),
    reason: dryv.field(sharedProperties.NonEmptyString1000).createOnly(),
    decidedAt: dryv.field(sharedProperties.Instant).createOnly(),
    policyVersion: dryv.field(sharedProperties.NonEmptyString255).createOnly(),
  })
  .extends(baseSchemas.Immutable)
  .description("Append-only attributable review decision on a revision.")
  .role("entity")
  .facets({
    storage: dryv.storage("reviews").index("reviewerId").index("revisionId"),
  });

export const PromotionRequests = staging
  .schema("PromotionRequests", {
    revisionId: belongsTo(() => Revisions),
    expectedMainVersion: dryv.field(sharedProperties.String255).maybe(),
    idempotencyKey: dryv.field(sharedProperties.String255).maybe(),
    requestHash: dryv.field(sharedProperties.Sha256),
    status: dryv.field(stagingEnums.PromotionStatus),
    publicationId: belongsTo(() => Publications),
    requestedBy: belongsTo(() => Accounts),
    requestedAt: dryv.field(sharedProperties.Instant),
    completedAt: dryv.field(sharedProperties.Instant).maybe(),
    failureCode: dryv.field(sharedProperties.String255).maybe(),
  })
  .extends(baseSchemas.Identified)
  .description("Request to promote a reviewed revision to Main through publication.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("promotion_requests")
      .index("publicationId")
      .index("requestedBy")
      .index("revisionId")
      .unique("idempotencyKey")
      .index("status", "requestedAt"),
  });

export const RevisionSources = staging
  .schema("RevisionSources", {
    revisionId: belongsTo(() => Revisions),
    sourceEvidenceRefId: dryv.field(sharedProperties.Id),
    sourceCitationRefId: dryv.field(sharedProperties.Id),
    fileVersionRefId: dryv.field(sharedProperties.Id),
    manifestReleaseRefId: dryv.field(sharedProperties.Id).maybe(),
    evidenceRole: dryv.field(sharedProperties.NonEmptyString100),
    contentHash: dryv.field(sharedProperties.Sha256),
    sourceSnapshot: dryv.field(sharedProperties.JsonText),
  })
  .extends(baseSchemas.Created)
  .description("Source evidence supporting a candidate revision.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("revision_sources")
      .unique("revisionId", "sourceCitationRefId", "evidenceRole")
      .index("sourceEvidenceRefId")
      .index("fileVersionRefId"),
  });
