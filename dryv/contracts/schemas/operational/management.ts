/**
 * Schema: management | Database: mzizi_operations
 * Approval: DEC-OPERATIONAL-DATABASE-20261112 (accepted, 2026-11-12); table and column inventory is unchanged.
 * Design: .docs/_plan/schema-redesign/mzizi-operational-db/management.md
 */
import * as dryv from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { Accounts } from "./auth.ts";

const belongsTo = dryv.belongsToUsing(sharedProperties.Id);

export const management = dryv
  .group({ name: "management" })
  .description("Schema release and publication bookkeeping scoped to Operations.")
  .facets({ storage: { namespace: "management", store: "operations" } });

/*---------------- Closed technical vocabulary ----------------*/
export const managementEnums = management.properties({
  PublicationState: dryv.property.enum([
    "requested",
    "submitted",
    "published",
    "rejected",
    "failed",
    "reconciling",
    "reconciled",
    "unknown",
  ]),
  DeliveryState: dryv.property.enum(["received", "accepted", "rejected", "duplicate", "conflict", "unknown"]),
  ManagementOperation: dryv.property.enum(["insert", "update", "retire", "upsert"]),
});

export const SchemaReleases = management
  .schema("SchemaReleases", {
    releaseId: dryv.field(sharedProperties.NonEmptyString255),
    databaseTarget: dryv.field(sharedProperties.StatusCode),
    digest: dryv.field(sharedProperties.Sha256),
    appliedAt: dryv.field(sharedProperties.Instant),
    managerVersion: dryv.field(sharedProperties.NonEmptyString100),
    appliedBy: belongsTo(() => Accounts).maybe(),
  })
  .extends(baseSchemas.Identified)
  .description("Operations schema release applied to the database, with digest and manager version.")
  .role("entity")
  .facets({
    storage: dryv.storage("schema_releases").index("appliedBy").unique("releaseId"),
  });

export const Publications = management
  .schema("Publications", {
    publicationId: dryv.field(sharedProperties.Id),
    requestKey: dryv.field(sharedProperties.NonEmptyString255),
    requestHash: dryv.field(sharedProperties.Sha256),
    actorSnapshot: dryv.field(sharedProperties.JsonText),
    contractVersion: dryv.field(sharedProperties.NonEmptyString255),
    state: dryv.field(managementEnums.PublicationState),
    requestedAt: dryv.field(sharedProperties.Instant),
    submittedAt: dryv.field(sharedProperties.Instant),
    publishedAt: dryv.field(sharedProperties.Instant).maybe(),
    lastReconciledAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.Identified)
  .description("Coordination record for publishing accepted records to Main; one per idempotent request.")
  .role("entity")
  .facets({
    storage: dryv.storage("publications").unique("publicationId").unique("requestKey").index("state", "requestedAt"),
  });

export const PublicationItems = management
  .schema("PublicationItems", {
    publicationId: belongsTo(() => Publications),
    schemaName: dryv.field(sharedProperties.NonEmptyString100),
    tableName: dryv.field(sharedProperties.NonEmptyString100),
    recordId: dryv.field(sharedProperties.Id),
    operation: dryv.field(managementEnums.ManagementOperation),
    expectedRecordVersion: dryv.field(sharedProperties.String255).maybe(),
    resultingRecordVersion: dryv.field(sharedProperties.String255).maybe(),
    payloadHash: dryv.field(sharedProperties.Sha256),
  })
  .extends(baseSchemas.Identified)
  .description("Record covered by a publication, with expected and resulting versions.")
  .role("entity")
  .facets({
    storage: dryv.storage("publication_items").index("publicationId"),
  });

export const DeliveryReceipts = management
  .schema("DeliveryReceipts", {
    publicationId: belongsTo(() => Publications),
    requestKey: dryv.field(sharedProperties.NonEmptyString255),
    requestHash: dryv.field(sharedProperties.Sha256),
    observedAt: dryv.field(sharedProperties.Instant),
    state: dryv.field(managementEnums.DeliveryState),
    mainCommitRef: dryv.field(sharedProperties.String255).maybe(),
    responseHash: dryv.field(sharedProperties.Sha256).maybe(),
    details: dryv.field(sharedProperties.JsonText).maybe(),
  })
  .extends(baseSchemas.Identified)
  .description("Operations reconciliation of what Main acknowledged for a publication.")
  .role("entity")
  .facets({
    storage: dryv.storage("delivery_receipts").index("publicationId").unique("requestKey"),
  });
