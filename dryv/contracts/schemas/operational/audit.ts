/**
 * Schema: audit | Database: mzizi_operations
 * Approval: DEC-OPERATIONAL-DATABASE-20261112 (accepted, 2026-11-12).
 * Design: .docs/_plan/schema-redesign/mzizi-operational-db/audit.md
 * Approved inventory: 2 tables and their listed columns. Technical choices
 * follow approved semantics; SQL migration/application remains unauthorized.
 * Required values have no implicit defaults; named database operations must supply them.
 * Relations restrict deletion and key updates to preserve referenced operational history.
 */
import * as dryv from "@dryvcode/author";
import { sharedProperties } from "#/schemas/_shared.ts";
import { authSchemas } from "./auth.ts";

export const audit = dryv
  .group({ name: "audit" })
  .description("Approved Mzizi Operations audit records.")
  .facets({ storage: { namespace: "audit", store: "operations" } });

/*---------------- Closed technical vocabulary enums ----------------*/
export const auditEnums = audit.properties({
  AuditAction: dryv.property.enum(["read", "create", "update", "delete", "review", "publish", "export", "admin"]),
  AuditDecisionType: dryv.property.enum(["approval", "review", "security", "publication"]),
  AuditDecision: dryv.property.enum(["approve", "reject", "request_changes"]),
  AuditSubjectKind: dryv.property.enum([
    "account",
    "role",
    "membership",
    "invitation",
    "scope",
    "publication",
    "candidate",
    "record",
  ]),
});

/*---------------- Approved audit table contracts ----------------*/
export const auditSchemas: Record<string, any> = {};
export const Events = audit.schemas({
  Events: dryv
    .schema({
      id: dryv.field(sharedProperties.Id).createOnly(),
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
      action: dryv.field(auditEnums.AuditAction).createOnly(),
      target_kind: dryv.field(sharedProperties.StatusCode).createOnly(),
      target_id: dryv.field(sharedProperties.Id).createOnly(),
      target_version: dryv.field(sharedProperties.String255).optional().nullable().createOnly(),
      request_id: dryv.field(sharedProperties.Id).optional().nullable().createOnly(),
      correlation_id: dryv.field(sharedProperties.Id).optional().nullable().createOnly(),
      recorded_at: dryv.field(sharedProperties.Instant).createOnly(),
      details: dryv.field(sharedProperties.JsonText).optional().nullable().createOnly(),
      previous_hash: dryv.field(sharedProperties.Sha256).optional().nullable().createOnly(),
      event_hash: dryv.field(sharedProperties.Sha256).createOnly(),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("events")
        .primaryKey("id")
        .indexes(
          { name: "idx_events_actor_id", fields: ["actor_id"] },
          { name: "uq_events_event_hash", fields: ["event_hash"], unique: true },
          { name: "idx_events_recorded_at", fields: ["recorded_at"] },
          { name: "idx_events_target_kind_target_id", fields: ["target_kind", "target_id"] },
        ),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */

auditSchemas.Events = Events.Events;

export const Decisions = audit.schemas({
  Decisions: dryv
    .schema({
      id: dryv.field(sharedProperties.Id).createOnly(),
      event_id: dryv
        .field(sharedProperties.Id)
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => auditSchemas.Events.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        })
        .createOnly(),
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
      decision_type: dryv.field(auditEnums.AuditDecisionType).createOnly(),
      decision: dryv.field(auditEnums.AuditDecision).createOnly(),
      subject_kind: dryv.field(auditEnums.AuditSubjectKind).createOnly(),
      subject_id: dryv.field(sharedProperties.Id).optional().nullable().createOnly(),
      subject_version: dryv.field(sharedProperties.String255).optional().nullable().createOnly(),
      policy_version: dryv.field(sharedProperties.NonEmptyString255).createOnly(),
      reason: dryv.field(sharedProperties.NonEmptyString1000).createOnly(),
      request_hash: dryv.field(sharedProperties.Sha256).createOnly(),
      decided_at: dryv.field(sharedProperties.Instant).createOnly(),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("decisions")
        .primaryKey("id")
        .indexes({ name: "idx_decisions_actor_id", fields: ["actor_id"] }, { name: "idx_decisions_event_id", fields: ["event_id"] }),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */

auditSchemas.Decisions = Decisions.Decisions;
