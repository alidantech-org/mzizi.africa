/**
 * Schema: acquisition | Database: mzizi_operations
 * Approval: DEC-OPERATIONAL-DATABASE-20261112 (accepted, 2026-11-12).
 * Design: .docs/_plan/schema-redesign/mzizi-operational-db/acquisition.md
 * Approved inventory: 7 tables and their listed columns. Technical choices
 * follow approved semantics; SQL migration/application remains unauthorized.
 * Required values have no implicit defaults; named database operations must supply them.
 * Relations restrict deletion and key updates to preserve referenced operational history.
 */
import * as dryv from "@dryvcode/author";
import { sharedProperties } from "../_shared.ts";
import { authSchemas } from "./auth.ts";
import { engineSchemas } from "./engine.ts";

export const acquisition = dryv
  .group({ name: "acquisition" })
  .description("Approved Mzizi Operations acquisition records.")
  .facets({ storage: { namespace: "acquisition" } });

/*---------------- Closed technical vocabulary enums ----------------*/
export const acquisitionEnums = acquisition.properties({
  TargetState: dryv.property.enum({
    Active: "active",
    Paused: "paused",
    Retired: "retired",
  }),
  FrontierState: dryv.property.enum({
    Queued: "queued",
    Leased: "leased",
    RetryWait: "retry_wait",
    Completed: "completed",
    Failed: "failed",
    Cancelled: "cancelled",
  }),
  AcquisitionOutcome: dryv.property.enum({
    Success: "success",
    Failure: "failure",
    Blocked: "blocked",
    Retryable: "retryable",
    Permanent: "permanent",
  }),
});

/*---------------- Approved acquisition table contracts ----------------*/
export const acquisitionSchemas: Record<string, any> = {};
export const Targets = acquisition.schemas({
  Targets: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      url: dryv.field(sharedProperties.Url),
      publisher_ref_id: dryv.field(sharedProperties.Id).optional().nullable(),
      policy_version_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => acquisitionSchemas.PolicyVersions.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      state: dryv.field(acquisitionEnums.TargetState),
      created_at: dryv.field(sharedProperties.Instant),
      updated_at: dryv.field(sharedProperties.Instant),
      retired_at: dryv.field(sharedProperties.Instant).optional().nullable(),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("targets")
        .primaryKey("id")
        .indexes(
          { name: "idx_targets_policy_version_id", fields: ["policy_version_id"] },
          { name: "uq_targets_url", fields: ["url"], unique: true },
        ),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */
/*---------------- End acquisition.targets ----------------*/
acquisitionSchemas.Targets = Targets.Targets;

export const Policies = acquisition.schemas({
  Policies: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      code: dryv.field(sharedProperties.IdentityCode),
      title: dryv.field(sharedProperties.NonEmptyString255),
      description: dryv.field(sharedProperties.Description).optional().nullable(),
      created_by: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Accounts.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      created_at: dryv.field(sharedProperties.Instant),
      retired_at: dryv.field(sharedProperties.Instant).optional().nullable(),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("policies")
        .primaryKey("id")
        .indexes({ name: "idx_policies_created_by", fields: ["created_by"] }, { name: "uq_policies_code", fields: ["code"], unique: true }),
    }),
});
/*---------------- End acquisition.policies ----------------*/
acquisitionSchemas.Policies = Policies.Policies;

export const PolicyVersions = acquisition.schemas({
  PolicyVersions: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      policy_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => acquisitionSchemas.Policies.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      version: dryv.field(sharedProperties.PositiveInteger),
      rules: dryv.field(sharedProperties.JsonText),
      rules_hash: dryv.field(sharedProperties.Sha256),
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
      approved_at: dryv.field(sharedProperties.Instant).optional().nullable(),
      effective_from: dryv.field(sharedProperties.Instant),
      effective_until: dryv.field(sharedProperties.Instant).optional().nullable(),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("policy_versions")
        .primaryKey("id")
        .indexes(
          { name: "idx_policy_versions_approved_by", fields: ["approved_by"] },
          { name: "uq_policy_versions_policy_id_version", fields: ["policy_id", "version"], unique: true },
        ),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */
/*---------------- End acquisition.policy_versions ----------------*/
acquisitionSchemas.PolicyVersions = PolicyVersions.PolicyVersions;

export const Frontier = acquisition.schemas({
  Frontier: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      target_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => acquisitionSchemas.Targets.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      url: dryv.field(sharedProperties.Url),
      priority: dryv.field(sharedProperties.Integer),
      state: dryv.field(acquisitionEnums.FrontierState),
      due_at: dryv.field(sharedProperties.Instant),
      lease_owner: dryv.field(sharedProperties.String255).optional().nullable(),
      lease_until: dryv.field(sharedProperties.Instant).optional().nullable(),
      lease_fence: dryv.field(sharedProperties.NonNegativeInteger),
      attempt_count: dryv.field(sharedProperties.NonNegativeInteger),
      last_attempt_at: dryv.field(sharedProperties.Instant).optional().nullable(),
      engine_job_id: dryv
        .field(sharedProperties.Id)
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => engineSchemas.Jobs.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        })
        .optional()
        .nullable(),
      created_at: dryv.field(sharedProperties.Instant),
      updated_at: dryv.field(sharedProperties.Instant),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("frontier")
        .primaryKey("id")
        .indexes(
          { name: "idx_frontier_engine_job_id", fields: ["engine_job_id"] },
          { name: "uq_frontier_target_id_url", fields: ["target_id", "url"], unique: true },
          { name: "idx_frontier_state_due_at", fields: ["state", "due_at"] },
        ),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */
/*---------------- End acquisition.frontier ----------------*/
acquisitionSchemas.Frontier = Frontier.Frontier;

export const AccessAttempts = acquisition.schemas({
  AccessAttempts: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      target_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => acquisitionSchemas.Targets.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      frontier_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => acquisitionSchemas.Frontier.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      run_id: dryv
        .field(sharedProperties.Id)
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => engineSchemas.Runs.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        })
        .optional()
        .nullable(),
      job_id: dryv
        .field(sharedProperties.Id)
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => engineSchemas.Jobs.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        })
        .optional()
        .nullable(),
      requested_url: dryv.field(sharedProperties.Url),
      started_at: dryv.field(sharedProperties.Instant).optional().nullable(),
      completed_at: dryv.field(sharedProperties.Instant).optional().nullable(),
      http_status: dryv.field(sharedProperties.HttpStatus).optional().nullable(),
      outcome: dryv.field(acquisitionEnums.AcquisitionOutcome),
      retry_after: dryv.field(sharedProperties.Instant).optional().nullable(),
      error_code: dryv.field(sharedProperties.String255).optional().nullable(),
      response_hash: dryv.field(sharedProperties.Sha256).optional().nullable(),
      artifact_id: dryv.field(sharedProperties.Id).optional().nullable(),
      bytes_received: dryv.field(sharedProperties.NonNegativeInt64).optional().nullable(),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("access_attempts")
        .primaryKey("id")
        .indexes(
          { name: "idx_access_attempts_run_id", fields: ["run_id"] },
          { name: "idx_access_attempts_job_id", fields: ["job_id"] },
          { name: "idx_access_attempts_target_id", fields: ["target_id"] },
          { name: "idx_access_attempts_frontier_id", fields: ["frontier_id"] },
          { name: "idx_access_attempts_started_at", fields: ["started_at"] },
        ),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */
/*---------------- End acquisition.access_attempts ----------------*/
acquisitionSchemas.AccessAttempts = AccessAttempts.AccessAttempts;

export const Observations = acquisition.schemas({
  Observations: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      target_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => acquisitionSchemas.Targets.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      access_attempt_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => acquisitionSchemas.AccessAttempts.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      url: dryv.field(sharedProperties.Url),
      canonical_url: dryv.field(sharedProperties.Url).optional().nullable(),
      content_hash: dryv.field(sharedProperties.Sha256),
      observed_at: dryv.field(sharedProperties.Instant),
      content_type: dryv.field(sharedProperties.String255).optional().nullable(),
      etag: dryv.field(sharedProperties.String255).optional().nullable(),
      last_modified: dryv.field(sharedProperties.String255).optional().nullable(),
      artifact_id: dryv.field(sharedProperties.Id).optional().nullable(),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("observations")
        .primaryKey("id")
        .indexes(
          { name: "idx_observations_target_id", fields: ["target_id"] },
          { name: "idx_observations_access_attempt_id", fields: ["access_attempt_id"] },
          { name: "idx_observations_observed_at", fields: ["observed_at"] },
        ),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */
/*---------------- End acquisition.observations ----------------*/
acquisitionSchemas.Observations = Observations.Observations;

export const DiscoveredLinks = acquisition.schemas({
  DiscoveredLinks: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      observation_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => acquisitionSchemas.Observations.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      target_url: dryv.field(sharedProperties.Url),
      normalized_url: dryv.field(sharedProperties.Url),
      anchor_text: dryv.field(sharedProperties.String1000).optional().nullable(),
      rel: dryv.field(sharedProperties.String255).optional().nullable(),
      resolved_target_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => acquisitionSchemas.Targets.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      discovered_at: dryv.field(sharedProperties.Instant),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("discovered_links")
        .primaryKey("id")
        .indexes(
          { name: "idx_discovered_links_observation_id", fields: ["observation_id"] },
          { name: "idx_discovered_links_resolved_target_id", fields: ["resolved_target_id"] },
        ),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */
/*---------------- End acquisition.discovered_links ----------------*/
acquisitionSchemas.DiscoveredLinks = DiscoveredLinks.DiscoveredLinks;
