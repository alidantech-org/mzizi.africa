import * as dryv from "@dryvcode/author";

import { shared, sharedProperties } from "./_shared.ts";
import { periodFields } from "./_periods.ts";
import { subjectFields, subjectSchemas } from "./_subjects.ts";
import { identity as identityLink } from "./postgres/_links.ts";

/** Shared description of every `code` column (`.docs/rules/codes.md`). */
export const codeDescription =
  "Stable row code (`.docs/rules/codes.md`): lowercase, dot-separated, unique and never reused.";

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
    version: dryv
      .field(sharedProperties.PositiveInteger)
      .system()
      .description("Optimistic-concurrency version; starts at 1 and increases on every update."),
    createdAt: dryv.field(sharedProperties.Instant).system(),
    updatedAt: dryv.field(sharedProperties.Instant).system(),
    deletedAt: dryv
      .field(sharedProperties.Instant)
      .maybe()
      .system()
      .description("Soft-delete time; empty while the record is live."),
  })
  .abstract()
  .description("Base for versioned records: id, version, created/updated timestamps and soft delete.")
  .facets({ storage: dryv.storage().primaryKey("id") });

/** Association rows: identity and creation/soft-delete only. No code, no version. */
const AssociationBase = dryv
  .schema({
    id: dryv.field(sharedProperties.Id),
    createdAt: dryv.field(sharedProperties.Instant).system(),
    deletedAt: dryv.field(sharedProperties.Instant).maybe().system(),
  })
  .abstract()
  .description("Base for association rows: id, created timestamp and soft delete.")
  .facets({ storage: dryv.storage().primaryKey("id") });

/**
 * Versioned record of a partitioned table. PostgreSQL requires the partition key in every primary and unique key, so
 * this base declares no primary key: the table declares `primaryKey("id", <partition key>)` itself.
 */
const PartitionedEntityBase = dryv
  .schema({
    id: dryv.field(sharedProperties.Id),
    version: dryv
      .field(sharedProperties.PositiveInteger)
      .system()
      .description("Optimistic-concurrency version; starts at 1 and increases on every update."),
    createdAt: dryv.field(sharedProperties.Instant).system(),
    updatedAt: dryv.field(sharedProperties.Instant).system(),
    deletedAt: dryv
      .field(sharedProperties.Instant)
      .maybe()
      .system()
      .description("Soft-delete time; empty while the record is live."),
  })
  .abstract()
  .description("Base for versioned records of partitioned tables: the table declares its own primary key.");

/** Append-only row of a partitioned table: identity and creation time; the table declares its own primary key. */
const PartitionedRecordBase = dryv
  .schema({
    id: dryv.field(sharedProperties.Id),
    createdAt: dryv.field(sharedProperties.Instant).system(),
  })
  .abstract()
  .description("Base for append-only rows of partitioned tables: the table declares its own primary key.");

const baseGroup = shared.schemas({
  Entity: EntityBase,
  Association: AssociationBase,
  PartitionedEntity: PartitionedEntityBase,
  PartitionedRecord: PartitionedRecordBase,
});

/*---------------- Operations bases ----------------*/
/*
 * Operations records are not versioned or soft-deleted: they are retired with an explicit timestamp,
 * superseded by a later row, or kept as history. These bases therefore carry only what the approved
 * Operations inventory lists, never `version` or `deletedAt`.
 */

/** Identity only. */
const IdentifiedBase = dryv
  .schema({ id: dryv.field(sharedProperties.Id) })
  .abstract()
  .description("Base for operational records: identity only.")
  .facets({ storage: dryv.storage().primaryKey("id") });

/** Identity that never changes after the row is written; for append-only history. */
const ImmutableBase = dryv
  .schema({ id: dryv.field(sharedProperties.Id).createOnly() })
  .abstract()
  .description("Base for append-only operational records: identity written once.")
  .facets({ storage: dryv.storage().primaryKey("id") });

const operationsGroup = shared.schemas({ Identified: IdentifiedBase, Immutable: ImmutableBase });

/** Identity and creation time. */
const CreatedBase = dryv
  .schema({ createdAt: dryv.field(sharedProperties.Instant).system() })
  .extends(operationsGroup.Identified)
  .abstract()
  .description("Base for operational records: identity and creation time.");

/** Identity with a stable, globally unique code. */
const CodedIdentifiedBase = dryv
  .schema({
    code: dryv.field(sharedProperties.IdentityCode).description(codeDescription),
  })
  .extends(operationsGroup.Identified)
  .abstract()
  .description("Base for operational records with a unique identity code.")
  .facets({ storage: dryv.storage().unique("code") });

const operationsChildGroup = shared.schemas({ Created: CreatedBase, CodedIdentified: CodedIdentifiedBase });

/** Identity, creation and last-change time. */
const TimestampedBase = dryv
  .schema({ updatedAt: dryv.field(sharedProperties.Instant).system() })
  .extends(operationsChildGroup.Created)
  .abstract()
  .description("Base for operational records: identity, creation time and last-change time.");

/** Coded identity and creation time. */
const CodedCreatedBase = dryv
  .schema({ createdAt: dryv.field(sharedProperties.Instant).system() })
  .extends(operationsChildGroup.CodedIdentified)
  .abstract()
  .description("Base for operational records with a unique identity code and creation time.");

const operationsLeafGroup = shared.schemas({ Timestamped: TimestampedBase, CodedCreated: CodedCreatedBase });

/** Predicate for indexes that should only cover live (not soft-deleted) rows. */
const baseRules = shared.expressions({
  LiveRecord: EntityBase.check((v) => v.deletedAt.isNull()),
});

/** Entity that also carries a stable, globally unique identity code. */
const CodedEntityBase = dryv
  .schema({
    code: dryv.field(sharedProperties.IdentityCode).description(codeDescription),
  })
  .extends(baseGroup.Entity)
  .abstract()
  .description("Base for versioned records with a unique identity code.")
  .facets({
    storage: dryv
      .storage()
      // Codes are never reused (`.docs/rules/codes.md`), so uniqueness covers deleted rows too.
      .unique("code"),
  });

/** Entity with a plain period: `fromYear` and `toYear`. */
const PeriodEntityBase = dryv
  .schema({ ...periodFields })
  .extends(baseGroup.Entity)
  .abstract()
  .description("Base for versioned records with a period of integer years.");

const periodGroup = shared.schemas({ PeriodEntity: PeriodEntityBase });
PeriodEntityBase.rule(shared, "PeriodYearsAreOrdered", dryv.rule.ordered("fromYear", "toYear", { allowEqual: true }));

/** Period entity that also carries a stable, globally unique identity code. */
const CodedPeriodEntityBase = dryv
  .schema({
    code: dryv.field(sharedProperties.IdentityCode).description(codeDescription),
  })
  .extends(periodGroup.PeriodEntity)
  .abstract()
  .description("Base for versioned records with a unique identity code and a period of integer years.")
  .facets({
    storage: dryv.storage().unique("code"),
  });

/**
 * Coded entity whose `id` is also an `identity.identities.id` (FOUNDATION_REDESIGN section 3.2). The `id` is a relation,
 * so reads can follow a row to its identity and from there to names, identifiers and addresses.
 */
const IdentityEntityBase = dryv
  .schema({
    id: identityLink("The identity this row extends: the same uuid as `identity.identities.id`."),
    version: dryv
      .field(sharedProperties.PositiveInteger)
      .system()
      .description("Optimistic-concurrency version; starts at 1 and increases on every update."),
    createdAt: dryv.field(sharedProperties.Instant).system(),
    updatedAt: dryv.field(sharedProperties.Instant).system(),
    deletedAt: dryv
      .field(sharedProperties.Instant)
      .maybe()
      .system()
      .description("Soft-delete time; empty while the record is live."),
    code: dryv.field(sharedProperties.IdentityCode).description(codeDescription),
  })
  .abstract()
  .description("Base for identity-backed records: the id is the identity's id; with a unique code.");
IdentityEntityBase.facets({
  storage: dryv.storage().primaryKey("id").unique("code"),
});

const codedGroup = shared.schemas({
  CodedEntity: CodedEntityBase,
  CodedPeriodEntity: CodedPeriodEntityBase,
  IdentityEntity: IdentityEntityBase,
});

/** Coded entity that concerns exactly one subject row (shared subjectTable and subjectId). */
const CodedSubjectEntityBase = dryv
  .schema({ ...subjectFields })
  .extends(codedGroup.CodedEntity)
  .abstract()
  .description("Base for versioned, coded records about one subject row.");

/** Coded period entity that concerns exactly one subject row. */
const CodedPeriodSubjectEntityBase = dryv
  .schema({ ...subjectFields })
  .extends(codedGroup.CodedPeriodEntity)
  .abstract()
  .description("Base for versioned, coded records about one subject row, with a period of integer years.");

const subjectEntityGroup = shared.schemas({
  CodedSubjectEntity: CodedSubjectEntityBase,
  CodedPeriodSubjectEntity: CodedPeriodSubjectEntityBase,
});

export const baseSchemas = {
  ...subjectSchemas,
  ...baseGroup,
  ...operationsGroup,
  ...operationsChildGroup,
  ...operationsLeafGroup,
  ...periodGroup,
  ...codedGroup,
  ...subjectEntityGroup,
};
