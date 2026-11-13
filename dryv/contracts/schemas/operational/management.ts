/**
 * Schema: management | Database: mzizi_operations
 * Approval: DEC-OPERATIONAL-DATABASE-20261112 (accepted, 2026-11-12).
 * Design: .docs/_plan/schema-redesign/mzizi-operational-db/management.md
 * Approved inventory: 4 tables and their listed columns. Technical choices
 * follow approved semantics; SQL migration/application remains unauthorized.
 * Required values have no implicit defaults; named database operations must supply them.
 * Relations restrict deletion and key updates to preserve referenced operational history.
 */
import * as dryv from "@dryvcode/author";
import { sharedProperties } from "../_shared.ts";
import { authSchemas } from "./auth.ts";

export const management = dryv
  .group({ name: "management" })
  .description("Approved Mzizi Operations management records.")
  .facets({ storage: { namespace: "management" } });

/*---------------- Closed technical vocabulary enums ----------------*/
export const managementEnums = management.properties({
  PublicationState: dryv.property.enum({
    Requested: "requested",
    Submitted: "submitted",
    Published: "published",
    Rejected: "rejected",
    Failed: "failed",
    Reconciling: "reconciling",
    Reconciled: "reconciled",
    Unknown: "unknown",
  }),
  DeliveryState: dryv.property.enum({
    Received: "received",
    Accepted: "accepted",
    Rejected: "rejected",
    Duplicate: "duplicate",
    Conflict: "conflict",
    Unknown: "unknown",
  }),
  ManagementOperation: dryv.property.enum({
    Insert: "insert",
    Update: "update",
    Retire: "retire",
    Upsert: "upsert",
  }),
});

/*---------------- Approved management table contracts ----------------*/
export const managementSchemas: Record<string, any> = {};
export const SchemaReleases = management.schemas({
  SchemaReleases: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      release_id: dryv.field(sharedProperties.NonEmptyString255),
      database_target: dryv.field(sharedProperties.StatusCode),
      digest: dryv.field(sharedProperties.Sha256),
      applied_at: dryv.field(sharedProperties.Instant),
      manager_version: dryv.field(sharedProperties.NonEmptyString100),
      applied_by: dryv
        .field(sharedProperties.Id)
        .relation({
          target: (): dryv.SchemaFieldRef<unknown> => authSchemas.Accounts.field("id"),
          cardinality: dryv.relation.manyToOne(),
          onDelete: "restrict",
          onUpdate: "restrict",
        })
        .optional()
        .nullable(),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("schema_releases")
        .primaryKey("id")
        .indexes(
          { name: "idx_schema_releases_applied_by", fields: ["applied_by"] },
          { name: "uq_schema_releases_release_id", fields: ["release_id"], unique: true },
        ),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */

managementSchemas.SchemaReleases = SchemaReleases.SchemaReleases;

export const Publications = management.schemas({
  Publications: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      publication_id: dryv.field(sharedProperties.Id),
      request_key: dryv.field(sharedProperties.NonEmptyString255),
      request_hash: dryv.field(sharedProperties.Sha256),
      actor_snapshot: dryv.field(sharedProperties.JsonText),
      contract_version: dryv.field(sharedProperties.NonEmptyString255),
      state: dryv.field(managementEnums.PublicationState),
      requested_at: dryv.field(sharedProperties.Instant),
      submitted_at: dryv.field(sharedProperties.Instant),
      published_at: dryv.field(sharedProperties.Instant).optional().nullable(),
      last_reconciled_at: dryv.field(sharedProperties.Instant).optional().nullable(),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("publications")
        .primaryKey("id")
        .indexes(
          { name: "uq_publications_publication_id", fields: ["publication_id"], unique: true },
          { name: "uq_publications_request_key", fields: ["request_key"], unique: true },
          { name: "idx_publications_state_requested_at", fields: ["state", "requested_at"] },
        ),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */

managementSchemas.Publications = Publications.Publications;

export const PublicationItems = management.schemas({
  PublicationItems: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      publication_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => managementSchemas.Publications.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      schema_name: dryv.field(sharedProperties.NonEmptyString100),
      table_name: dryv.field(sharedProperties.NonEmptyString100),
      record_id: dryv.field(sharedProperties.Id),
      operation: dryv.field(managementEnums.ManagementOperation),
      expected_record_version: dryv.field(sharedProperties.String255).optional().nullable(),
      resulting_record_version: dryv.field(sharedProperties.String255).optional().nullable(),
      payload_hash: dryv.field(sharedProperties.Sha256),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("publication_items")
        .primaryKey("id")
        .indexes({ name: "idx_publication_items_publication_id", fields: ["publication_id"] }),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */

managementSchemas.PublicationItems = PublicationItems.PublicationItems;

export const DeliveryReceipts = management.schemas({
  DeliveryReceipts: dryv
    .schema({
      id: dryv.field(sharedProperties.Id),
      publication_id: dryv.field(sharedProperties.Id).relation({
        target: (): dryv.SchemaFieldRef<unknown> => managementSchemas.Publications.field("id"),
        cardinality: dryv.relation.manyToOne(),
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
      request_key: dryv.field(sharedProperties.NonEmptyString255),
      request_hash: dryv.field(sharedProperties.Sha256),
      observed_at: dryv.field(sharedProperties.Instant),
      state: dryv.field(managementEnums.DeliveryState),
      main_commit_ref: dryv.field(sharedProperties.String255).optional().nullable(),
      response_hash: dryv.field(sharedProperties.Sha256).optional().nullable(),
      details: dryv.field(sharedProperties.JsonText).optional().nullable(),
    })
    .role("entity")
    .facets({
      storage: dryv
        .storage("delivery_receipts")
        .primaryKey("id")
        .indexes(
          { name: "idx_delivery_receipts_publication_id", fields: ["publication_id"] },
          { name: "uq_delivery_receipts_request_key", fields: ["request_key"], unique: true },
        ),
    }),
});
/** Primary key and relation lookup indexes are declared in this storage contract. */

managementSchemas.DeliveryReceipts = DeliveryReceipts.DeliveryReceipts;
