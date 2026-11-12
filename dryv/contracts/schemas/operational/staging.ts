/**
 * Schema: staging | Database: mzizi_operations
 * Approval: DEC-OPERATIONAL-DATABASE-20261112 (accepted, 2026-11-12).
 * Design: .docs/_plan/schema-redesign/mzizi-operational-db/staging.md
 * Approved inventory: 6 tables and their listed columns. Technical choices
 * follow approved semantics; SQL migration/application remains unauthorized.
 * Required values have no implicit defaults; named database operations must supply them.
 * Relations restrict deletion and key updates to preserve referenced operational history.
 */
import * as dryv from "@dryvcode/author";
import { sharedProperties } from "../_shared.ts";
import { authSchemas } from "./auth.ts";
import { engineSchemas } from "./engine.ts";
import { managementSchemas } from "./management.ts";

export const staging = dryv
  .group({ name: "staging" })
  .description("Approved Mzizi Operations staging records.")
  .facets({ storage: { namespace: "staging" } });

/*---------------- Closed technical vocabulary enums ----------------*/
export const stagingEnums = staging.properties({
  CandidateStatus: dryv.property.enum({
    Pending: "pending",
    InReview: "in_review",
    Accepted: "accepted",
    Rejected: "rejected",
    Promoted: "promoted",
    Superseded: "superseded",
  }),
  MappingStatus: dryv.property.enum({ Draft: "draft", Active: "active", Retired: "retired" }),
  PromotionStatus: dryv.property.enum({
    Pending: "pending",
    Submitted: "submitted",
    Succeeded: "succeeded",
    Failed: "failed",
    Rejected: "rejected",
    ReconciliationRequired: "reconciliation_required",
  }),
  StagingSeverity: dryv.property.enum({
    Info: "info",
    Warning: "warning",
    Error: "error",
    Critical: "critical",
  }),
  StagingDecision: dryv.property.enum({
    Approve: "approve",
    Reject: "reject",
    Requestchanges: "request_changes",
  }),
});

/*---------------- Approved staging table contracts ----------------*/
export const stagingSchemas: Record<string, any> = {};
export const Candidates = staging.schemas({
  Candidates: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      target_schema: dryv.field(sharedProperties.NonEmptyString100),
      target_table: dryv.field(sharedProperties.NonEmptyString100),
      target_contract: dryv.field(sharedProperties.NonEmptyString255),
      target_contract_version: dryv.field(sharedProperties.NonEmptyString255),
      stable_key: dryv.field(sharedProperties.String500).optional().nullable(),
      source_run_id: dryv
        .field(sharedProperties.Id)
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => engineSchemas.Runs.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        })
        .optional()
        .nullable(),
      status: dryv.field(stagingEnums.CandidateStatus),
      current_revision_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => stagingSchemas.Revisions.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        }),
      created_by: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Accounts.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      created_at: dryv.field(sharedProperties.Instant),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("candidates")
        .primaryKey("id")
        .indexes(
          { name: "idx_candidates_source_run_id", fields: ["source_run_id"] },
          { name: "idx_candidates_created_by", fields: ["created_by"] },
          { name: "idx_candidates_current_revision_id", fields: ["current_revision_id"] },
          { name: "idx_candidates_status_created_at", fields: ["status", "created_at"] },
        ),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */
/*---------------- End staging.candidates ----------------*/
stagingSchemas.Candidates = Candidates.Candidates;

export const Revisions = staging.schemas({
  Revisions: dryv
    .schema({
      id: dryv.field(sharedProperties.Id).createOnly(),
      candidate_id: dryv
        .field(sharedProperties.Id)
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => stagingSchemas.Candidates.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        })
        .createOnly(),
      revision_number: dryv.field(sharedProperties.PositiveInteger).createOnly(),
      payload: dryv.field(sharedProperties.JsonText).createOnly(),
      schema_version: dryv.field(sharedProperties.NonEmptyString100).createOnly(),
      content_hash: dryv.field(sharedProperties.Sha256).createOnly(),
      artifact_id: dryv.field(sharedProperties.Id).optional().nullable().createOnly(),
      source_manifest_key: dryv.field(sharedProperties.String1000).optional().nullable().createOnly(),
      source_manifest_hash: dryv.field(sharedProperties.Sha256).optional().nullable().createOnly(),
      created_by: dryv
        .field(sharedProperties.Id)
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Accounts.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        })
        .createOnly(),
      created_at: dryv.field(sharedProperties.Instant).createOnly(),
      supersedes_revision_id: dryv
        .field(sharedProperties.Id)
        .optional()
        .nullable()
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => stagingSchemas.Revisions.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        })
        .createOnly(),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("revisions")
        .primaryKey("id")
        .indexes(
          { name: "idx_revisions_created_by", fields: ["created_by"] },
          { name: "idx_revisions_supersedes_revision_id", fields: ["supersedes_revision_id"] },
          { name: "uq_revisions_candidate_id_revision_number", fields: ["candidate_id", "revision_number"], unique: true },
        ),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */
/*---------------- End staging.revisions ----------------*/
stagingSchemas.Revisions = Revisions.Revisions;

export const Mappings = staging.schemas({
  Mappings: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      source_kind: dryv.field(sharedProperties.NonEmptyString100),
      target_contract: dryv.field(sharedProperties.NonEmptyString255),
      target_contract_version: dryv.field(sharedProperties.NonEmptyString255),
      version: dryv.field(sharedProperties.PositiveInteger),
      mapping_definition: dryv.field(sharedProperties.JsonText),
      mapping_hash: dryv.field(sharedProperties.Sha256),
      model_provider: dryv.field(sharedProperties.String255).optional().nullable(),
      model_name: dryv.field(sharedProperties.String255).optional().nullable(),
      model_version: dryv.field(sharedProperties.String255).optional().nullable(),
      status: dryv.field(stagingEnums.MappingStatus),
      created_by: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Accounts.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
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
      created_at: dryv.field(sharedProperties.Instant),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("mappings")
        .primaryKey("id")
        .indexes(
          { name: "idx_mappings_created_by", fields: ["created_by"] },
          { name: "idx_mappings_approved_by", fields: ["approved_by"] },
        ),
    }),
});
/*---------------- End staging.mappings ----------------*/
stagingSchemas.Mappings = Mappings.Mappings;

export const Findings = staging.schemas({
  Findings: dryv
    .schema({
      id: dryv.field(sharedProperties.Id).createOnly(),
      revision_id: dryv
        .field(sharedProperties.Id)
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => stagingSchemas.Revisions.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        })
        .createOnly(),
      path: dryv.field(sharedProperties.NonEmptyString1000).createOnly(),
      code: dryv.field(sharedProperties.IdentityCode).createOnly(),
      severity: dryv.field(stagingEnums.StagingSeverity).createOnly(),
      message: dryv.field(sharedProperties.NonEmptyString1000).createOnly(),
      details: dryv.field(sharedProperties.JsonText).optional().nullable().createOnly(),
      rule_version: dryv.field(sharedProperties.NonEmptyString255).createOnly(),
      created_at: dryv.field(sharedProperties.Instant).createOnly(),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("findings")
        .primaryKey("id")
        .indexes({ name: "idx_findings_revision_id", fields: ["revision_id"] }),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */
/*---------------- End staging.findings ----------------*/
stagingSchemas.Findings = Findings.Findings;

export const Reviews = staging.schemas({
  Reviews: dryv
    .schema({
      id: dryv.field(sharedProperties.Id).createOnly(),
      revision_id: dryv
        .field(sharedProperties.Id)
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => stagingSchemas.Revisions.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        })
        .createOnly(),
      reviewer_id: dryv
        .field(sharedProperties.Id)
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Accounts.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        })
        .createOnly(),
      decision: dryv.field(stagingEnums.StagingDecision).createOnly(),
      reason: dryv.field(sharedProperties.NonEmptyString1000).createOnly(),
      decided_at: dryv.field(sharedProperties.Instant).createOnly(),
      policy_version: dryv.field(sharedProperties.NonEmptyString255).createOnly(),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("reviews")
        .primaryKey("id")
        .indexes(
          { name: "idx_reviews_reviewer_id", fields: ["reviewer_id"] },
          { name: "idx_reviews_revision_id", fields: ["revision_id"] },
        ),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */
/*---------------- End staging.reviews ----------------*/
stagingSchemas.Reviews = Reviews.Reviews;

export const PromotionRequests = staging.schemas({
  PromotionRequests: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      revision_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => stagingSchemas.Revisions.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      expected_main_version: dryv.field(sharedProperties.String255).optional().nullable(),
      idempotency_key: dryv.field(sharedProperties.String255).optional().nullable(),
      request_hash: dryv.field(sharedProperties.Sha256),
      status: dryv.field(stagingEnums.PromotionStatus),
      publication_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => managementSchemas.Publications.field("id"),
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
      requested_at: dryv.field(sharedProperties.Instant),
      completed_at: dryv.field(sharedProperties.Instant).optional().nullable(),
      failure_code: dryv.field(sharedProperties.String255).optional().nullable(),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("promotion_requests")
        .primaryKey("id")
        .indexes(
          { name: "idx_promotion_requests_publication_id", fields: ["publication_id"] },
          { name: "idx_promotion_requests_requested_by", fields: ["requested_by"] },
          { name: "idx_promotion_requests_revision_id", fields: ["revision_id"] },
          { name: "uq_promotion_requests_idempotency_key", fields: ["idempotency_key"], unique: true },
          { name: "idx_promotion_requests_status_requested_at", fields: ["status", "requested_at"] },
        ),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */
/*---------------- End staging.promotion_requests ----------------*/
stagingSchemas.PromotionRequests = PromotionRequests.PromotionRequests;
