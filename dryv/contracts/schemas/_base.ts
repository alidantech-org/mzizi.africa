import * as dryv from "@dryvcode/author";

import { shared, sharedProperties } from "./_shared.ts";

/**
 * Abstract base schemas. A concrete schema declares `.extends(<Base>)` and inherits the base fields,
 * primary key and indexes; it does not repeat them. Generated code that has no inheritance (SQL)
 * receives the effective, flattened fields and storage, so the column set is the same everywhere.
 *
 * Pick the smallest base that fits. Bases are deliberately separate so a schema is never forced to
 * carry columns it has no use for.
 */

/** Identity, optimistic version, audit timestamps and soft delete. */
const EntityBase = dryv
  .schema({
    id: dryv.field(sharedProperties.Id),
    /** Optimistic-concurrency version; starts at 1 and increases on every update. */
    version: dryv.field(sharedProperties.PositiveInteger),
    created_at: dryv.field(sharedProperties.Instant),
    updated_at: dryv.field(sharedProperties.Instant),
    /** Soft delete marker; null while the record is live. */
    deleted_at: dryv.field(sharedProperties.Instant).optional().nullable(),
  })
  .abstract()
  .description("Base for versioned records: id, version, created/updated timestamps and soft delete.")
  .facets({ storage: dryv.storage().primaryKey("id") });

/** Association rows: identity and creation/soft-delete only. No code, no version. */
const AssociationBase = dryv
  .schema({
    id: dryv.field(sharedProperties.Id),
    created_at: dryv.field(sharedProperties.Instant),
    deleted_at: dryv.field(sharedProperties.Instant).optional().nullable(),
  })
  .abstract()
  .description("Base for association rows: id, created timestamp and soft delete.")
  .facets({ storage: dryv.storage().primaryKey("id") });

const baseGroup = shared.schemas({ Entity: EntityBase, Association: AssociationBase });

/** Predicate for indexes that should only cover live (not soft-deleted) rows. */
const baseRules = shared.expressions({
  LiveRecord: EntityBase.check((v) => v.deleted_at.isNull()),
});

/** Entity that also carries a stable, globally unique identity code. */
const CodedEntityBase = dryv
  .schema({
    /** Stable identity code: lowercase, dot-separated, repository-wide unique. */
    code: dryv.field(sharedProperties.IdentityCode),
  })
  .extends(baseGroup.Entity)
  .abstract()
  .description("Base for versioned records with a unique identity code.")
  .facets({
    storage: dryv
      .storage()
      // Unique among live rows only, so a soft-deleted record releases its code.
      .indexes({ fields: ["code"], unique: true, where: baseRules.LiveRecord }),
  });

export const baseSchemas = {
  ...baseGroup,
  ...shared.schemas({ CodedEntity: CodedEntityBase }),
};
