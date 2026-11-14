/**
 * Schema: analytics | Database: mzizi_operations
 * Approval: DEC-OPERATIONAL-DATABASE-20261112 (accepted, 2026-11-12); table and column inventory is unchanged.
 * Design: .docs/_plan/schema-redesign/mzizi-operational-db/analytics.md
 */
import * as dryv from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { Accounts } from "./auth.ts";
import { Runs } from "./engine.ts";

const belongsTo = dryv.belongsToUsing(sharedProperties.Id);

export const analytics = dryv
  .group({ name: "analytics" })
  .description("Unpublished analytical requests, projections, experiments and results.")
  .facets({ storage: { namespace: "analytics", store: "operations" } });

/*---------------- Closed technical vocabulary ----------------*/
export const analyticsEnums = analytics.properties({
  ExperimentStatus: dryv.property.enum(["draft", "active", "completed", "archived"]),
  RequestStatus: dryv.property.enum(["pending", "running", "succeeded", "failed", "cancelled"]),
});

export const Experiments = analytics
  .schema("Experiments", {
    title: dryv.field(sharedProperties.NonEmptyString255),
    hypothesis: dryv.field(sharedProperties.Description).maybe(),
    protocol: dryv.field(sharedProperties.JsonText),
    protocolVersion: dryv.field(sharedProperties.NonEmptyString100),
    status: dryv.field(analyticsEnums.ExperimentStatus),
    createdBy: belongsTo(() => Accounts),
    closedAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.CodedCreated)
  .description("Stable experiment identity for unpublished analytical work.")
  .role("entity")
  .facets({
    storage: dryv.storage("experiments").index("createdBy"),
  });

export const Requests = analytics
  .schema("Requests", {
    experimentId: belongsTo(() => Experiments),
    requestedBy: belongsTo(() => Accounts),
    queryContract: dryv.field(sharedProperties.NonEmptyString255),
    queryVersion: dryv.field(sharedProperties.NonEmptyString100),
    inputReleaseIds: dryv.field(sharedProperties.JsonText),
    requestHash: dryv.field(sharedProperties.Sha256),
    engineRunId: belongsTo(() => Runs).maybe(),
    status: dryv.field(analyticsEnums.RequestStatus),
    requestedAt: dryv.field(sharedProperties.Instant),
    completedAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.Identified)
  .description("Analytical job specification and its lifecycle.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("requests")
      .index("requestedBy")
      .index("engineRunId")
      .index("experimentId")
      .index("experimentId", "requestedAt"),
  });

export const Projections = analytics
  .schema("Projections", {
    requestId: belongsTo(() => Requests).maybe(),
    sourceContract: dryv.field(sharedProperties.NonEmptyString255),
    sourceRelease: dryv.field(sharedProperties.NonEmptyString255),
    objectKey: dryv.field(sharedProperties.NonEmptyString1000),
    sha256: dryv.field(sharedProperties.Sha256),
    schemaVersion: dryv.field(sharedProperties.NonEmptyString100),
    rowCount: dryv.field(sharedProperties.NonNegativeInt64),
    expiresAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.Created)
  .description("Rebuildable query-optimized input dataset.")
  .role("entity")
  .facets({
    storage: dryv.storage("projections").index("requestId").unique("requestId", "sourceContract", "sourceRelease"),
  });

export const Results = analytics
  .schema("Results", {
    requestId: belongsTo(() => Requests).maybe(),
    methodVersion: dryv.field(sharedProperties.NonEmptyString255),
    objectKey: dryv.field(sharedProperties.NonEmptyString1000),
    inlineSummary: dryv.field(sharedProperties.Description).maybe(),
    sha256: dryv.field(sharedProperties.Sha256),
  })
  .extends(baseSchemas.Created)
  .description("Unpublished analytical result reference; never accepted data.")
  .role("entity")
  .facets({
    storage: dryv.storage("results").unique("requestId", "methodVersion"),
  });

export const Evaluations = analytics
  .schema("Evaluations", {
    resultId: belongsTo(() => Results),
    checkName: dryv.field(sharedProperties.NonEmptyString255),
    passed: dryv.field(sharedProperties.Flag),
    details: dryv.field(sharedProperties.JsonText).maybe(),
    evaluatorVersion: dryv.field(sharedProperties.NonEmptyString255),
    checkedAt: dryv.field(sharedProperties.Instant),
  })
  .extends(baseSchemas.Identified)
  .description("Quality and reproducibility check on an analytical result.")
  .role("entity")
  .facets({
    storage: dryv.storage("evaluations").index("resultId").unique("resultId", "checkName", "evaluatorVersion"),
  });
