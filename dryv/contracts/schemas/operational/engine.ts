/**
 * Schema: engine | Database: mzizi_operations
 * Approval: DEC-OPERATIONAL-DATABASE-20261112 (accepted, 2026-11-12); table and column inventory is unchanged.
 * Design: .docs/_plan/schema-redesign/mzizi-operational-db/engine.md
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { Accounts } from "./auth.ts";

const belongsTo = dryv.belongsToUsing(sharedProperties.Id);

export const engine = dryv
  .group({ name: "engine" })
  .description("Pipeline releases, runs, jobs, attempts, checkpoints and delivery coordination.")
  .facets({ storage: { namespace: "engine", store: "operations" } });

/*---------------- Closed technical vocabulary ----------------*/
export const engineEnums = engine.properties({
  EngineTriggerKind: dryv.property.enum(["manual", "scheduled", "event", "retry", "api"]),
  RunStatus: dryv.property.enum(["pending", "queued", "running", "succeeded", "failed", "cancelled"]),
  JobStatus: dryv.property.enum([
    "pending",
    "ready",
    "leased",
    "running",
    "succeeded",
    "failed",
    "retry_wait",
    "blocked",
    "cancelled",
  ]),
  AttemptStatus: dryv.property.enum(["running", "succeeded", "failed", "timed_out", "cancelled"]),
  OutboxStatus: dryv.property.enum(["pending", "delivered", "failed", "dead_lettered"]),
  EngineKind: dryv.property.enum(["pipeline", "extraction", "validation", "publication", "system", "user"]),
  EngineEventKind: dryv.property.enum([
    "run_submitted",
    "run_started",
    "run_completed",
    "run_cancelled",
    "job_scheduled",
    "job_started",
    "job_completed",
    "job_failed",
    "checkpoint_saved",
    "artifact_registered",
    "outbox_queued",
  ]),
  EngineDependencyKind: dryv.property.enum(["requires_success", "requires_completion", "optional"]),
  EngineRole: dryv.property.enum(["input", "output", "intermediate", "log", "checkpoint"]),
  EngineAccessClassification: dryv.property.enum(["public", "restricted", "confidential", "private"]),
});

export const Pipelines = engine
  .schema("Pipelines", {
    title: dryv.field(sharedProperties.NonEmptyString255),
    description: dryv.field(sharedProperties.Description).maybe(),
    ownerAccountId: belongsTo(() => Accounts),
    enabled: dryv.field(sharedProperties.Flag),
    retiredAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.CodedCreated)
  .description("Stable pipeline identity with an owner.")
  .role("entity")
  .facets({
    storage: dryv.storage("pipelines").index("ownerAccountId"),
  });

export const PipelineReleases = engine
  .schema("PipelineReleases", {
    pipelineId: belongsTo(() => Pipelines),
    version: dryv.field(sharedProperties.PositiveInteger),
    manifestHash: dryv.field(sharedProperties.Sha256),
    manifestObjectKey: dryv.field(sharedProperties.NonEmptyString1000),
    manifestReleaseRefId: dryv.field(sharedProperties.Id).maybe(),
    inputSchemaCode: dryv.field(sharedProperties.IdentityCode).maybe(),
    inputSchemaVersion: dryv.field(sharedProperties.NonEmptyString100).maybe(),
    capabilityVersions: dryv.field(sharedProperties.JsonText).maybe(),
    contractVersion: dryv.field(sharedProperties.NonEmptyString255),
    approvedBy: belongsTo(() => Accounts).maybe(),
    releasedAt: dryv.field(sharedProperties.Instant),
  })
  .extends(baseSchemas.Identified)
  .description("Immutable pipeline definition released under a pipeline.")
  .role("entity")
  .facets({
    storage: dryv.storage("pipeline_releases").index("approvedBy").unique("pipelineId", "version"),
  });

export const Runs = engine
  .schema("Runs", {
    releaseId: belongsTo(() => PipelineReleases),
    requestedBy: belongsTo(() => Accounts),
    triggerKind: dryv.field(engineEnums.EngineTriggerKind),
    triggerRef: dryv.field(sharedProperties.String1000).maybe(),
    idempotencyKey: dryv.field(sharedProperties.String255).maybe(),
    requestHash: dryv.field(sharedProperties.Sha256),
    status: dryv.field(engineEnums.RunStatus),
    submittedAt: dryv.field(sharedProperties.Instant),
    startedAt: dryv.field(sharedProperties.Instant).maybe(),
    finishedAt: dryv.field(sharedProperties.Instant).maybe(),
    cancelledAt: dryv.field(sharedProperties.Instant).maybe(),
    summary: dryv.field(sharedProperties.JsonText).maybe(),
  })
  .extends(baseSchemas.Identified)
  .description("One invocation of a pipeline release, with its trigger and lifecycle.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("runs")
      .index("requestedBy")
      .index("releaseId")
      .unique("idempotencyKey")
      .index("status", "submittedAt"),
  });

export const Jobs = engine
  .schema("Jobs", {
    runId: belongsTo(() => Runs).maybe(),
    kind: dryv.field(engineEnums.EngineKind),
    inputRef: dryv.field(sharedProperties.String1000).maybe(),
    status: dryv.field(engineEnums.JobStatus),
    attemptCount: dryv.field(sharedProperties.NonNegativeInteger),
    maxAttempts: dryv.field(sharedProperties.PositiveInteger),
    nextAttemptAt: dryv.field(sharedProperties.Instant).maybe(),
    leaseOwner: dryv.field(sharedProperties.String255).maybe(),
    leaseUntil: dryv.field(sharedProperties.Instant).maybe(),
    fence: dryv.field(sharedProperties.NonNegativeInteger),
    startedAt: dryv.field(sharedProperties.Instant).maybe(),
    finishedAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.Created)
  .description("Retryable unit of execution within a run, with a lease and fencing counter.")
  .role("entity")
  .facets({
    storage: dryv.storage("jobs").index("runId").index("status", "nextAttemptAt"),
  });

export const JobDependencies = engine
  .schema("JobDependencies", {
    jobId: belongsTo(() => Jobs),
    dependsOnJobId: belongsTo(() => Jobs),
    dependencyKind: dryv.field(engineEnums.EngineDependencyKind),
    createdAt: dryv.field(sharedProperties.Instant),
  })
  .rule("JobsMustDiffer", rule.differs("jobId", "dependsOnJobId"))
  .description("Ordering dependency between two jobs; a job never depends on itself.")
  .role("entity")
  .facets({
    storage: dryv.storage("job_dependencies").primaryKey("jobId", "dependsOnJobId").index("dependsOnJobId"),
  });

export const JobAttempts = engine
  .schema("JobAttempts", {
    jobId: belongsTo(() => Jobs).maybe(),
    attemptNumber: dryv.field(sharedProperties.PositiveInteger),
    workerIdentity: dryv.field(sharedProperties.NonEmptyString255),
    startedAt: dryv.field(sharedProperties.Instant).maybe(),
    finishedAt: dryv.field(sharedProperties.Instant).maybe(),
    status: dryv.field(engineEnums.AttemptStatus),
    errorCode: dryv.field(sharedProperties.String255).maybe(),
    errorSummary: dryv.field(sharedProperties.Description).maybe(),
    inputHash: dryv.field(sharedProperties.Sha256).maybe(),
    outputHash: dryv.field(sharedProperties.Sha256).maybe(),
  })
  .extends(baseSchemas.Identified)
  .description("One execution attempt of a job by a worker.")
  .role("entity")
  .facets({
    storage: dryv.storage("job_attempts").unique("jobId", "attemptNumber"),
  });

export const Checkpoints = engine
  .schema("Checkpoints", {
    jobId: belongsTo(() => Jobs).maybe(),
    sequence: dryv.field(sharedProperties.NonNegativeInteger),
    checkpointKey: dryv.field(sharedProperties.NonEmptyString255),
    stateHash: dryv.field(sharedProperties.Sha256),
    artifactId: belongsTo(() => Artifacts).maybe(),
    savedAt: dryv.field(sharedProperties.Instant),
  })
  .extends(baseSchemas.Identified)
  .description("Resumable progress marker saved by a job.")
  .role("entity")
  .facets({
    storage: dryv.storage("checkpoints").index("artifactId").unique("jobId", "sequence"),
  });

export const Events = engine
  .schema("Events", {
    runId: belongsTo(() => Runs)
      .maybe()
      .createOnly(),
    jobId: belongsTo(() => Jobs)
      .maybe()
      .createOnly(),
    sequence: dryv.field(sharedProperties.NonNegativeInteger).createOnly(),
    kind: dryv.field(engineEnums.EngineEventKind).createOnly(),
    actorId: belongsTo(() => Accounts)
      .maybe()
      .createOnly(),
    occurredAt: dryv.field(sharedProperties.Instant).createOnly(),
    payload: dryv.field(sharedProperties.JsonText).createOnly(),
  })
  .extends(baseSchemas.Immutable)
  .description("Append-only operational execution history in sequence.")
  .role("entity")
  .facets({
    storage: dryv.storage("events").index("actorId").index("jobId").unique("runId", "sequence"),
  });

export const Outbox = engine
  .schema("Outbox", {
    eventId: belongsTo(() => Events),
    destination: dryv.field(sharedProperties.NonEmptyString255),
    status: dryv.field(engineEnums.OutboxStatus),
    attempts: dryv.field(sharedProperties.NonNegativeInteger),
    nextAttemptAt: dryv.field(sharedProperties.Instant).maybe(),
    deliveredAt: dryv.field(sharedProperties.Instant).maybe(),
    lastError: dryv.field(sharedProperties.Description).maybe(),
    idempotencyKey: dryv.field(sharedProperties.String255).maybe(),
  })
  .extends(baseSchemas.Identified)
  .description("Durable delivery obligation to be sent at least once.")
  .role("entity")
  .facets({
    storage: dryv.storage("outbox").unique("eventId", "destination").index("status", "nextAttemptAt"),
  });

export const Artifacts = engine
  .schema("Artifacts", {
    runId: belongsTo(() => Runs).maybe(),
    jobId: belongsTo(() => Jobs).maybe(),
    objectKey: dryv.field(sharedProperties.NonEmptyString1000),
    sha256: dryv.field(sharedProperties.Sha256),
    sizeBytes: dryv.field(sharedProperties.NonNegativeInt64),
    mediaType: dryv.field(sharedProperties.String255).maybe(),
    role: dryv.field(engineEnums.EngineRole),
    accessClassification: dryv.field(engineEnums.EngineAccessClassification),
    expiresAt: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.Created)
  .description("Temporary operational object reference with a hash and access classification.")
  .role("entity")
  .facets({
    storage: dryv.storage("artifacts").index("runId").index("jobId"),
  });
