/**
 * Schema: acquisition | Database: mzizi_operations
 * Approval: DEC-OPERATIONAL-DATABASE-20261112 (accepted, 2026-11-12); table and column inventory is unchanged.
 * Design: .docs/_plan/schema-redesign/mzizi-operational-db/acquisition.md
 */
import * as dryv from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { Accounts } from "./auth.ts";
import { Artifacts, Jobs, Runs } from "./engine.ts";

const belongsTo = dryv.belongsToUsing(sharedProperties.Id);

export const acquisition = dryv
  .group({ name: "acquisition" })
  .description("Source discovery, crawl state, access attempts and observed links.")
  .facets({ storage: { namespace: "acquisition", store: "operations" } });

/*---------------- Closed technical vocabulary ----------------*/
export const acquisitionEnums = acquisition.properties({
  TargetState: dryv.property.enum(["active", "paused", "retired"]),
  FrontierState: dryv.property.enum(["queued", "leased", "retry_wait", "completed", "failed", "cancelled"]),
  AcquisitionOutcome: dryv.property.enum(["success", "failure", "blocked", "retryable", "permanent"]),
});

export const Targets = acquisition
  .schema("Targets", {
    url: dryv.field(sharedProperties.Url),
    publisherRefId: dryv.field(sharedProperties.Id).maybe(),
    policyVersionId: belongsTo(() => PolicyVersions).maybe(),
    state: dryv.field(acquisitionEnums.TargetState),
    retiredAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.Timestamped)
  .description("Collection target under an access policy; the URL is the stable identity.")
  .role("entity")
  .facets({
    storage: dryv.storage("targets").index("policyVersionId").unique("url"),
  });

export const Policies = acquisition
  .schema("Policies", {
    title: dryv.field(sharedProperties.NonEmptyString255),
    description: dryv.field(sharedProperties.Description).maybe(),
    createdBy: belongsTo(() => Accounts),
    retiredAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.CodedCreated)
  .description("Stable access-policy identity; rules live in immutable versions.")
  .role("entity")
  .facets({
    storage: dryv.storage("policies").index("createdBy"),
  });

export const PolicyVersions = acquisition
  .schema("PolicyVersions", {
    policyId: belongsTo(() => Policies),
    version: dryv.field(sharedProperties.PositiveInteger),
    rules: dryv.field(sharedProperties.JsonText),
    rulesHash: dryv.field(sharedProperties.Sha256),
    approvedBy: belongsTo(() => Accounts).maybe(),
    approvedAt: dryv.field(sharedProperties.Instant).maybe(),
    effectiveFrom: dryv.field(sharedProperties.Instant),
    effectiveUntil: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.Identified)
  .description("Immutable versioned access rules with approval and an effective period.")
  .role("entity")
  .facets({
    storage: dryv.storage("policy_versions").index("approvedBy").unique("policyId", "version"),
  });

export const Frontier = acquisition
  .schema("Frontier", {
    targetId: belongsTo(() => Targets),
    url: dryv.field(sharedProperties.Url),
    priority: dryv.field(sharedProperties.Integer),
    state: dryv.field(acquisitionEnums.FrontierState),
    dueAt: dryv.field(sharedProperties.Instant),
    leaseOwner: dryv.field(sharedProperties.String255).maybe(),
    leaseUntil: dryv.field(sharedProperties.Instant).maybe(),
    leaseFence: dryv.field(sharedProperties.NonNegativeInteger),
    attemptCount: dryv.field(sharedProperties.NonNegativeInteger),
    lastAttemptAt: dryv.field(sharedProperties.Instant).maybe(),
    engineJobId: belongsTo(() => Jobs).maybe(),
  })
  .extends(baseSchemas.Timestamped)
  .description("Retryable crawl queue entry with a lease and fencing counter.")
  .role("entity")
  .facets({
    storage: dryv.storage("frontier").index("engineJobId").unique("targetId", "url").index("state", "dueAt"),
  });

export const AccessAttempts = acquisition
  .schema("AccessAttempts", {
    targetId: belongsTo(() => Targets),
    frontierId: belongsTo(() => Frontier).maybe(),
    runId: belongsTo(() => Runs).maybe(),
    jobId: belongsTo(() => Jobs).maybe(),
    requestedUrl: dryv.field(sharedProperties.Url),
    startedAt: dryv.field(sharedProperties.Instant).maybe(),
    completedAt: dryv.field(sharedProperties.Instant).maybe(),
    httpStatus: dryv.field(sharedProperties.HttpStatus).maybe(),
    outcome: dryv.field(acquisitionEnums.AcquisitionOutcome),
    retryAfter: dryv.field(sharedProperties.Instant).maybe(),
    errorCode: dryv.field(sharedProperties.String255).maybe(),
    responseHash: dryv.field(sharedProperties.Sha256).maybe(),
    artifactId: belongsTo(() => Artifacts).maybe(),
    bytesReceived: dryv.field(sharedProperties.NonNegativeInt64).maybe(),
  })
  .extends(baseSchemas.Identified)
  .description("Recorded request to a target with outcome, status and retained artifact.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("access_attempts")
      .index("runId")
      .index("jobId")
      .index("targetId")
      .index("frontierId")
      .index("startedAt"),
  });

export const Observations = acquisition
  .schema("Observations", {
    targetId: belongsTo(() => Targets),
    accessAttemptId: belongsTo(() => AccessAttempts),
    url: dryv.field(sharedProperties.Url),
    canonicalUrl: dryv.field(sharedProperties.Url).maybe(),
    contentHash: dryv.field(sharedProperties.Sha256),
    observedAt: dryv.field(sharedProperties.Instant),
    contentType: dryv.field(sharedProperties.String255).maybe(),
    etag: dryv.field(sharedProperties.String255).maybe(),
    lastModified: dryv.field(sharedProperties.String255).maybe(),
    artifactId: belongsTo(() => Artifacts).maybe(),
  })
  .extends(baseSchemas.Identified)
  .description("Observed content fingerprint of a fetched page, linked to its access attempt.")
  .role("entity")
  .facets({
    storage: dryv.storage("observations").index("targetId").index("accessAttemptId").index("observedAt"),
  });

export const DiscoveredLinks = acquisition
  .schema("DiscoveredLinks", {
    observationId: belongsTo(() => Observations),
    targetUrl: dryv.field(sharedProperties.Url),
    normalizedUrl: dryv.field(sharedProperties.Url),
    anchorText: dryv.field(sharedProperties.String1000).maybe(),
    rel: dryv.field(sharedProperties.String255).maybe(),
    resolvedTargetId: belongsTo(() => Targets).maybe(),
    discoveredAt: dryv.field(sharedProperties.Instant),
  })
  .extends(baseSchemas.Identified)
  .description("Link found in an observation, optionally resolved to a collection target.")
  .role("entity")
  .facets({
    storage: dryv.storage("discovered_links").index("observationId").index("resolvedTargetId"),
  });
