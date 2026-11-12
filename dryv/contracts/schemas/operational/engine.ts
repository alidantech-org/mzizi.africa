/**
 * Schema: engine | Database: mzizi_operations
 * Approval: DEC-OPERATIONAL-DATABASE-20261112 (accepted, 2026-11-12).
 * Design: .docs/_plan/schema-redesign/mzizi-operational-db/engine.md
 * Approved inventory: 10 tables and their listed columns. Technical choices
 * follow approved semantics; SQL migration/application remains unauthorized.
 * Required values have no implicit defaults; named database operations must supply them.
 * Relations restrict deletion and key updates to preserve referenced operational history.
 */
import * as dryv from "@dryvcode/author";
import { sharedProperties } from "../_shared.ts";
import { authSchemas } from "./auth.ts";

export const engine = dryv
  .group({ name: "engine" })
  .description("Approved Mzizi Operations engine records.")
  .facets({ storage: { namespace: "engine" } });

/*---------------- Closed technical vocabulary enums ----------------*/
export const engineEnums = engine.properties({
  EngineTriggerKind: dryv.property.enum({
    Manual: "manual",
    Scheduled: "scheduled",
    Event: "event",
    Retry: "retry",
    Api: "api",
  }),
  RunStatus: dryv.property.enum({
    Pending: "pending",
    Queued: "queued",
    Running: "running",
    Succeeded: "succeeded",
    Failed: "failed",
    Cancelled: "cancelled",
  }),
  JobStatus: dryv.property.enum({
    Pending: "pending",
    Ready: "ready",
    Leased: "leased",
    Running: "running",
    Succeeded: "succeeded",
    Failed: "failed",
    RetryWait: "retry_wait",
    Blocked: "blocked",
    Cancelled: "cancelled",
  }),
  AttemptStatus: dryv.property.enum({
    Running: "running",
    Succeeded: "succeeded",
    Failed: "failed",
    TimedOut: "timed_out",
    Cancelled: "cancelled",
  }),
  OutboxStatus: dryv.property.enum({ Pending: "pending", Delivered: "delivered", Failed: "failed", DeadLettered: "dead_lettered" }),
  EngineKind: dryv.property.enum({
    Pipeline: "pipeline",
    Extraction: "extraction",
    Validation: "validation",
    Publication: "publication",
    System: "system",
    User: "user",
  }),
  EngineEventKind: dryv.property.enum({
    RunSubmitted: "run_submitted",
    RunStarted: "run_started",
    RunCompleted: "run_completed",
    RunCancelled: "run_cancelled",
    JobScheduled: "job_scheduled",
    JobStarted: "job_started",
    JobCompleted: "job_completed",
    JobFailed: "job_failed",
    CheckpointSaved: "checkpoint_saved",
    ArtifactRegistered: "artifact_registered",
    OutboxQueued: "outbox_queued",
  }),
  EngineDependencyKind: dryv.property.enum({
    Requiressuccess: "requires_success",
    Requirescompletion: "requires_completion",
    Optional: "optional",
  }),
  EngineRole: dryv.property.enum({
    Input: "input",
    Output: "output",
    Intermediate: "intermediate",
    Log: "log",
    Checkpoint: "checkpoint",
  }),
  EngineAccessClassification: dryv.property.enum({
    Public: "public",
    Restricted: "restricted",
    Confidential: "confidential",
    Private: "private",
  }),
});

export const engineExpressions = engine.expressions({
  JobsMustDiffer: dryv.expression.notEqual(
    dryv.expression.context("value", "job_id"),
    dryv.expression.context("value", "depends_on_job_id"),
  ),
});

/*---------------- Approved engine table contracts ----------------*/
export const engineSchemas: Record<string, any> = {};
export const Pipelines = engine.schemas({
  Pipelines: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      code: dryv.field(sharedProperties.IdentityCode),
      title: dryv.field(sharedProperties.NonEmptyString255),
      description: dryv.field(sharedProperties.Description).optional().nullable(),
      owner_account_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Accounts.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      enabled: dryv.field(sharedProperties.Flag),
      created_at: dryv.field(sharedProperties.Instant),
      retired_at: dryv.field(sharedProperties.Instant).optional().nullable(),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("pipelines")
        .primaryKey("id")
        .indexes(
          { name: "idx_pipelines_owner_account_id", fields: ["owner_account_id"] },
          { name: "uq_pipelines_code", fields: ["code"], unique: true },
        ),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */
/*---------------- End engine.pipelines ----------------*/
engineSchemas.Pipelines = Pipelines.Pipelines;

export const PipelineReleases = engine.schemas({
  PipelineReleases: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      pipeline_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => engineSchemas.Pipelines.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      version: dryv.field(sharedProperties.PositiveInteger),
      manifest_hash: dryv.field(sharedProperties.Sha256),
      manifest_object_key: dryv.field(sharedProperties.NonEmptyString1000),
      /** Opaque Main manifest release identity pinned with the hash. */
      manifest_release_ref_id: dryv.field(sharedProperties.Id).optional().nullable(),
      input_schema_code: dryv.field(sharedProperties.IdentityCode).optional().nullable(),
      input_schema_version: dryv.field(sharedProperties.NonEmptyString100).optional().nullable(),
      capability_versions: dryv.field(sharedProperties.JsonText).optional().nullable(),
      contract_version: dryv.field(sharedProperties.NonEmptyString255),
      approved_by: dryv
        .field(sharedProperties.Id)
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Accounts.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        })
        .optional()
        .nullable(),
      released_at: dryv.field(sharedProperties.Instant),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("pipeline_releases")
        .primaryKey("id")
        .indexes(
          { name: "idx_pipeline_releases_approved_by", fields: ["approved_by"] },
          { name: "uq_pipeline_releases_pipeline_id_version", fields: ["pipeline_id", "version"], unique: true },
        ),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */
/*---------------- End engine.pipeline_releases ----------------*/
engineSchemas.PipelineReleases = PipelineReleases.PipelineReleases;

export const Runs = engine.schemas({
  Runs: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      release_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => engineSchemas.PipelineReleases.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      requested_by: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Accounts.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      trigger_kind: dryv.field(engineEnums.EngineTriggerKind),
      trigger_ref: dryv.field(sharedProperties.String1000).optional().nullable(),
      idempotency_key: dryv.field(sharedProperties.String255).optional().nullable(),
      request_hash: dryv.field(sharedProperties.Sha256),
      status: dryv.field(engineEnums.RunStatus),
      submitted_at: dryv.field(sharedProperties.Instant),
      started_at: dryv.field(sharedProperties.Instant).optional().nullable(),
      finished_at: dryv.field(sharedProperties.Instant).optional().nullable(),
      cancelled_at: dryv.field(sharedProperties.Instant).optional().nullable(),
      summary: dryv.field(sharedProperties.JsonText).optional().nullable(),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("runs")
        .primaryKey("id")
        .indexes(
          { name: "idx_runs_requested_by", fields: ["requested_by"] },
          { name: "idx_runs_release_id", fields: ["release_id"] },
          { name: "uq_runs_idempotency_key", fields: ["idempotency_key"], unique: true },
          { name: "idx_runs_status_submitted_at", fields: ["status", "submitted_at"] },
        ),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */
/*---------------- End engine.runs ----------------*/
engineSchemas.Runs = Runs.Runs;

export const Jobs = engine.schemas({
  Jobs: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      run_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => engineSchemas.Runs.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      kind: dryv.field(engineEnums.EngineKind),
      input_ref: dryv.field(sharedProperties.String1000).optional().nullable(),
      status: dryv.field(engineEnums.JobStatus),
      attempt_count: dryv.field(sharedProperties.NonNegativeInteger),
      max_attempts: dryv.field(sharedProperties.PositiveInteger),
      next_attempt_at: dryv.field(sharedProperties.Instant).optional().nullable(),
      lease_owner: dryv.field(sharedProperties.String255).optional().nullable(),
      lease_until: dryv.field(sharedProperties.Instant).optional().nullable(),
      fence: dryv.field(sharedProperties.NonNegativeInteger),
      created_at: dryv.field(sharedProperties.Instant),
      started_at: dryv.field(sharedProperties.Instant).optional().nullable(),
      finished_at: dryv.field(sharedProperties.Instant).optional().nullable(),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("jobs")
        .primaryKey("id")
        .indexes(
          { name: "idx_jobs_run_id", fields: ["run_id"] },
          { name: "idx_jobs_status_next_attempt_at", fields: ["status", "next_attempt_at"] },
        ),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */
/*---------------- End engine.jobs ----------------*/
engineSchemas.Jobs = Jobs.Jobs;

export const JobDependencies = engine.schemas({
  JobDependencies: dryv
    .schema({
      job_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => engineSchemas.Jobs.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      depends_on_job_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => engineSchemas.Jobs.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      dependency_kind: dryv.field(engineEnums.EngineDependencyKind),
      created_at: dryv.field(sharedProperties.Instant),
    })
    .invariant("JobsMustDiffer", engineExpressions.JobsMustDiffer, { message: "A job cannot depend on itself." })
    .role("entity")
    .facets({
      storage: dryv
        .storage("job_dependencies")
        .primaryKey("job_id", "depends_on_job_id")
        .indexes({ name: "idx_job_dependencies_depends_on_job_id", fields: ["depends_on_job_id"] }),
    }),
});
/*---------------- End engine.job_dependencies ----------------*/
engineSchemas.JobDependencies = JobDependencies.JobDependencies;

export const JobAttempts = engine.schemas({
  JobAttempts: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      job_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => engineSchemas.Jobs.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      attempt_number: dryv.field(sharedProperties.PositiveInteger),
      worker_identity: dryv.field(sharedProperties.NonEmptyString255),
      started_at: dryv.field(sharedProperties.Instant).optional().nullable(),
      finished_at: dryv.field(sharedProperties.Instant).optional().nullable(),
      status: dryv.field(engineEnums.AttemptStatus),
      error_code: dryv.field(sharedProperties.String255).optional().nullable(),
      error_summary: dryv.field(sharedProperties.Description).optional().nullable(),
      input_hash: dryv.field(sharedProperties.Sha256).optional().nullable(),
      output_hash: dryv.field(sharedProperties.Sha256).optional().nullable(),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("job_attempts")
        .primaryKey("id")
        .indexes({ name: "uq_job_attempts_job_id_attempt_number", fields: ["job_id", "attempt_number"], unique: true }),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */
/*---------------- End engine.job_attempts ----------------*/
engineSchemas.JobAttempts = JobAttempts.JobAttempts;

export const Checkpoints = engine.schemas({
  Checkpoints: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      job_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => engineSchemas.Jobs.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      sequence: dryv.field(sharedProperties.NonNegativeInteger),
      checkpoint_key: dryv.field(sharedProperties.NonEmptyString255),
      state_hash: dryv.field(sharedProperties.Sha256),
      artifact_id: dryv
        .field(sharedProperties.Id)
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => engineSchemas.Artifacts.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        })
        .optional()
        .nullable(),
      saved_at: dryv.field(sharedProperties.Instant),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("checkpoints")
        .primaryKey("id")
        .indexes(
          { name: "idx_checkpoints_artifact_id", fields: ["artifact_id"] },
          { name: "uq_checkpoints_job_id_sequence", fields: ["job_id", "sequence"], unique: true },
        ),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */
/*---------------- End engine.checkpoints ----------------*/
engineSchemas.Checkpoints = Checkpoints.Checkpoints;

export const Events = engine.schemas({
  Events: dryv
    .schema({
      id: dryv.field(sharedProperties.Id).createOnly(),
      run_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => engineSchemas.Runs.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        })
        .createOnly(),
      job_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => engineSchemas.Jobs.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        })
        .createOnly(),
      sequence: dryv.field(sharedProperties.NonNegativeInteger).createOnly(),
      kind: dryv.field(engineEnums.EngineEventKind).createOnly(),
      actor_id: dryv
        .field(sharedProperties.Id)
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Accounts.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        })
        .optional()
        .nullable()
        .createOnly(),
      occurred_at: dryv.field(sharedProperties.Instant).createOnly(),
      payload: dryv.field(sharedProperties.JsonText).createOnly(),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("events")
        .primaryKey("id")
        .indexes(
          { name: "idx_events_actor_id", fields: ["actor_id"] },
          { name: "idx_events_job_id", fields: ["job_id"] },
          { name: "uq_events_run_id_sequence", fields: ["run_id", "sequence"], unique: true },
        ),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */
/*---------------- End engine.events ----------------*/
engineSchemas.Events = Events.Events;

export const Outbox = engine.schemas({
  Outbox: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      event_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => engineSchemas.Events.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      destination: dryv.field(sharedProperties.NonEmptyString255),
      status: dryv.field(engineEnums.OutboxStatus),
      attempts: dryv.field(sharedProperties.NonNegativeInteger),
      next_attempt_at: dryv.field(sharedProperties.Instant).optional().nullable(),
      delivered_at: dryv.field(sharedProperties.Instant).optional().nullable(),
      last_error: dryv.field(sharedProperties.Description).optional().nullable(),
      idempotency_key: dryv.field(sharedProperties.String255).optional().nullable(),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("outbox")
        .primaryKey("id")
        .indexes(
          { name: "uq_outbox_event_id_destination", fields: ["event_id", "destination"], unique: true },
          { name: "idx_outbox_status_next_attempt_at", fields: ["status", "next_attempt_at"] },
        ),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */
/*---------------- End engine.outbox ----------------*/
engineSchemas.Outbox = Outbox.Outbox;

export const Artifacts = engine.schemas({
  Artifacts: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      run_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => engineSchemas.Runs.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      job_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => engineSchemas.Jobs.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      object_key: dryv.field(sharedProperties.NonEmptyString1000),
      sha256: dryv.field(sharedProperties.Sha256),
      size_bytes: dryv.field(sharedProperties.NonNegativeInt64),
      media_type: dryv.field(sharedProperties.String255).optional().nullable(),
      role: dryv.field(engineEnums.EngineRole),
      access_classification: dryv.field(engineEnums.EngineAccessClassification),
      created_at: dryv.field(sharedProperties.Instant),
      expires_at: dryv.field(sharedProperties.Instant).optional().nullable(),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("artifacts")
        .primaryKey("id")
        .indexes({ name: "idx_artifacts_run_id", fields: ["run_id"] }, { name: "idx_artifacts_job_id", fields: ["job_id"] }),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */
/*---------------- End engine.artifacts ----------------*/
engineSchemas.Artifacts = Artifacts.Artifacts;
