/**
 * Schema: audit | Database: mzizi_operations
 * Approval: DEC-OPERATIONAL-DATABASE-20261112 (accepted, 2026-11-12); table and column inventory is unchanged.
 * Design: .docs/_plan/schema-redesign/mzizi-operational-db/audit.md
 */
import * as dryv from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { Accounts } from "./auth.ts";

const belongsTo = dryv.belongsToUsing(sharedProperties.Id);

export const audit = dryv
  .group({ name: "audit" })
  .description("Operational and security events and decisions; never civic data or public accountability findings.")
  .facets({ storage: { namespace: "audit", store: "operations" } });

/*---------------- Closed technical vocabulary ----------------*/
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

export const Events = audit
  .schema("Events", {
    actorId: belongsTo(() => Accounts)
      .maybe()
      .createOnly(),
    action: dryv.field(auditEnums.AuditAction).createOnly(),
    targetKind: dryv.field(sharedProperties.StatusCode).createOnly(),
    targetId: dryv.field(sharedProperties.Id).createOnly(),
    targetVersion: dryv.field(sharedProperties.String255).maybe().createOnly(),
    requestId: dryv.field(sharedProperties.Id).maybe().createOnly(),
    correlationId: dryv.field(sharedProperties.Id).maybe().createOnly(),
    recordedAt: dryv.field(sharedProperties.Instant).createOnly(),
    details: dryv.field(sharedProperties.JsonText).maybe().createOnly(),
    previousHash: dryv.field(sharedProperties.Sha256).maybe().createOnly(),
    eventHash: dryv.field(sharedProperties.Sha256).createOnly(),
  })
  .extends(baseSchemas.Immutable)
  .description("Immutable attributable operational action, hash-chained to the previous event.")
  .role("entity")
  .facets({
    storage: dryv.storage("events").index("actorId").unique("eventHash").index("recordedAt").index("targetKind", "targetId"),
  });

export const Decisions = audit
  .schema("Decisions", {
    eventId: belongsTo(() => Events).createOnly(),
    actorId: belongsTo(() => Accounts)
      .maybe()
      .createOnly(),
    decisionType: dryv.field(auditEnums.AuditDecisionType).createOnly(),
    decision: dryv.field(auditEnums.AuditDecision).createOnly(),
    subjectKind: dryv.field(auditEnums.AuditSubjectKind).createOnly(),
    subjectId: dryv.field(sharedProperties.Id).maybe().createOnly(),
    subjectVersion: dryv.field(sharedProperties.String255).maybe().createOnly(),
    policyVersion: dryv.field(sharedProperties.NonEmptyString255).createOnly(),
    reason: dryv.field(sharedProperties.NonEmptyString1000).createOnly(),
    requestHash: dryv.field(sharedProperties.Sha256).createOnly(),
    decidedAt: dryv.field(sharedProperties.Instant).createOnly(),
  })
  .extends(baseSchemas.Immutable)
  .description("Operational review decision with the policy version, reason and request it applied to.")
  .role("entity")
  .facets({
    storage: dryv.storage("decisions").index("actorId").index("eventId"),
  });
