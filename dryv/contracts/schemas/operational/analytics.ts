/**
 * Schema: analytics | Database: mzizi_operations
 * Approval: DEC-OPERATIONAL-DATABASE-20261112 (accepted, 2026-11-12).
 * Design: .docs/_plan/schema-redesign/mzizi-operational-db/analytics.md
 * Approved inventory: 5 tables and their listed columns. Technical choices
 * follow approved semantics; SQL migration/application remains unauthorized.
 * Required values have no implicit defaults; named database operations must supply them.
 * Relations restrict deletion and key updates to preserve referenced operational history.
 */
import * as dryv from "@dryvcode/author";
import { sharedProperties } from "../_shared.ts";
import { authSchemas } from "./auth.ts";
import { engineSchemas } from "./engine.ts";

export const analytics = dryv
  .group({ name: "analytics" })
  .description("Approved Mzizi Operations analytics records.")
  .facets({ storage: { namespace: "analytics" } });

/*---------------- Closed technical vocabulary enums ----------------*/
export const analyticsEnums = analytics.properties({
  ExperimentStatus: dryv.property.enum({
    Draft: "draft",
    Active: "active",
    Completed: "completed",
    Archived: "archived",
  }),
  RequestStatus: dryv.property.enum({
    Pending: "pending",
    Running: "running",
    Succeeded: "succeeded",
    Failed: "failed",
    Cancelled: "cancelled",
  }),
});

/*---------------- Approved analytics table contracts ----------------*/
export const analyticsSchemas: Record<string, any> = {};
export const Experiments = analytics.schemas({
  Experiments: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      code: dryv.field(sharedProperties.IdentityCode),
      title: dryv.field(sharedProperties.NonEmptyString255),
      hypothesis: dryv.field(sharedProperties.Description).optional().nullable(),
      protocol: dryv.field(sharedProperties.JsonText),
      protocol_version: dryv.field(sharedProperties.NonEmptyString100),
      status: dryv.field(analyticsEnums.ExperimentStatus),
      created_by: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Accounts.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      created_at: dryv.field(sharedProperties.Instant),
      closed_at: dryv.field(sharedProperties.Instant).optional().nullable(),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("experiments")
        .primaryKey("id")
        .indexes(
          { name: "idx_experiments_created_by", fields: ["created_by"] },
          { name: "uq_experiments_code", fields: ["code"], unique: true },
        ),
    }),
});

analyticsSchemas.Experiments = Experiments.Experiments;

export const Requests = analytics.schemas({
  Requests: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      experiment_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => analyticsSchemas.Experiments.field("id"),
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
      query_contract: dryv.field(sharedProperties.NonEmptyString255),
      query_version: dryv.field(sharedProperties.NonEmptyString100),
      input_release_ids: dryv.field(sharedProperties.JsonText),
      request_hash: dryv.field(sharedProperties.Sha256),
      engine_run_id: dryv
        .field(sharedProperties.Id)
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => engineSchemas.Runs.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        })
        .optional()
        .nullable(),
      status: dryv.field(analyticsEnums.RequestStatus),
      requested_at: dryv.field(sharedProperties.Instant),
      completed_at: dryv.field(sharedProperties.Instant).optional().nullable(),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("requests")
        .primaryKey("id")
        .indexes(
          { name: "idx_requests_requested_by", fields: ["requested_by"] },
          { name: "idx_requests_engine_run_id", fields: ["engine_run_id"] },
          { name: "idx_requests_experiment_id", fields: ["experiment_id"] },
          { name: "idx_requests_experiment_id_requested_at", fields: ["experiment_id", "requested_at"] },
        ),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */

analyticsSchemas.Requests = Requests.Requests;

export const Projections = analytics.schemas({
  Projections: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      request_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => analyticsSchemas.Requests.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      source_contract: dryv.field(sharedProperties.NonEmptyString255),
      source_release: dryv.field(sharedProperties.NonEmptyString255),
      object_key: dryv.field(sharedProperties.NonEmptyString1000),
      sha256: dryv.field(sharedProperties.Sha256),
      schema_version: dryv.field(sharedProperties.NonEmptyString100),
      row_count: dryv.field(sharedProperties.NonNegativeInt64),
      created_at: dryv.field(sharedProperties.Instant),
      expires_at: dryv.field(sharedProperties.Instant).optional().nullable(),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("projections")
        .primaryKey("id")
        .indexes(
          { name: "idx_projections_request_id", fields: ["request_id"] },
          {
            name: "uq_projections_request_id_source_contract_source_release",
            fields: ["request_id", "source_contract", "source_release"],
            unique: true,
          },
        ),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */

analyticsSchemas.Projections = Projections.Projections;

export const Results = analytics.schemas({
  Results: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      request_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => analyticsSchemas.Requests.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      method_version: dryv.field(sharedProperties.NonEmptyString255),
      object_key: dryv.field(sharedProperties.NonEmptyString1000),
      inline_summary: dryv.field(sharedProperties.Description).optional().nullable(),
      sha256: dryv.field(sharedProperties.Sha256),
      created_at: dryv.field(sharedProperties.Instant),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("results")
        .primaryKey("id")
        .indexes({ name: "uq_results_request_id_method_version", fields: ["request_id", "method_version"], unique: true }),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */

analyticsSchemas.Results = Results.Results;

export const Evaluations = analytics.schemas({
  Evaluations: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      result_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => analyticsSchemas.Results.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      check_name: dryv.field(sharedProperties.NonEmptyString255),
      passed: dryv.field(sharedProperties.Flag),
      details: dryv.field(sharedProperties.JsonText).optional().nullable(),
      evaluator_version: dryv.field(sharedProperties.NonEmptyString255),
      checked_at: dryv.field(sharedProperties.Instant),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("evaluations")
        .primaryKey("id")
        .indexes(
          { name: "idx_evaluations_result_id", fields: ["result_id"] },
          {
            name: "uq_evaluations_result_id_check_name_evaluator_version",
            fields: ["result_id", "check_name", "evaluator_version"],
            unique: true,
          },
        ),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */

analyticsSchemas.Evaluations = Evaluations.Evaluations;
