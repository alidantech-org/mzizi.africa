import * as dryv from "@dryvcode/author";

import { shared, sharedProperties } from "./_shared.ts";
import { subjectFields, subjectSchemas } from "./_subjects.ts";

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
    version: dryv.field(sharedProperties.PositiveInteger).system(),
    createdAt: dryv.field(sharedProperties.Instant).system(),
    updatedAt: dryv.field(sharedProperties.Instant).system(),
    /** Soft delete marker; null while the record is live. */
    deletedAt: dryv.field(sharedProperties.Instant).maybe().system(),
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

const baseGroup = shared.schemas({ Entity: EntityBase, Association: AssociationBase });

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
    /** Stable identity code: lowercase, dot-separated, repository-wide unique. */
    code: dryv.field(sharedProperties.IdentityCode),
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

/** Entity that is valid over an optional period: both ends may be unknown, and an open end has no limit. */
const ValidityEntityBase = dryv
  .schema({
    validFrom: dryv.field(sharedProperties.CalendarDate).maybe(),
    validUntil: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .extends(baseGroup.Entity)
  .abstract()
  .description("Base for versioned records valid over an optional period.");

const validityGroup = shared.schemas({ ValidityEntity: ValidityEntityBase });
ValidityEntityBase.rule(shared, "ValidityWindowIsOrdered", dryv.rule.ordered("validFrom", "validUntil"));

/** Validity entity that also carries a stable, globally unique identity code. */
const CodedValidityEntityBase = dryv
  .schema({
    /** Stable identity code: lowercase, dot-separated, repository-wide unique. */
    code: dryv.field(sharedProperties.IdentityCode),
  })
  .extends(validityGroup.ValidityEntity)
  .abstract()
  .description("Base for versioned records with a unique identity code and an optional validity period.")
  .facets({
    storage: dryv.storage().unique("code").where(baseRules.LiveRecord),
  });

/**
 * Validity whose ends may be uncertain, for historical records: `validFrom`/`validUntil` are the best estimate and the
 * earliest/latest pairs bound it ("between 1400 and 1600"). Any of them may be unknown.
 */
const HistoricalValidityEntityBase = dryv
  .schema({
    validFromEarliest: dryv.field(sharedProperties.CalendarDate).maybe(),
    validFromLatest: dryv.field(sharedProperties.CalendarDate).maybe(),
    validUntilEarliest: dryv.field(sharedProperties.CalendarDate).maybe(),
    validUntilLatest: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .extends(validityGroup.ValidityEntity)
  .abstract()
  .description("Base for versioned records valid over a period whose start and end may be uncertain.");
HistoricalValidityEntityBase.rule(shared, "StartBoundsAreOrdered", dryv.rule.ordered("validFromEarliest", "validFromLatest"));
HistoricalValidityEntityBase.rule(shared, "EndBoundsAreOrdered", dryv.rule.ordered("validUntilEarliest", "validUntilLatest"));

const historicalGroup = shared.schemas({ HistoricalValidityEntity: HistoricalValidityEntityBase });

/** Historical validity entity that also carries a stable, globally unique identity code. */
const CodedHistoricalEntityBase = dryv
  .schema({
    code: dryv.field(sharedProperties.IdentityCode),
  })
  .extends(historicalGroup.HistoricalValidityEntity)
  .abstract()
  .description("Base for versioned records with a unique identity code and an uncertain validity period.")
  .facets({
    storage: dryv.storage().unique("code").where(baseRules.LiveRecord),
  });

const codedGroup = shared.schemas({
  CodedEntity: CodedEntityBase,
  CodedValidityEntity: CodedValidityEntityBase,
  CodedHistoricalEntity: CodedHistoricalEntityBase,
});

/** Coded entity that concerns exactly one subject row (shared subjectTable and subjectId). */
const CodedSubjectEntityBase = dryv
  .schema({ ...subjectFields })
  .extends(codedGroup.CodedEntity)
  .abstract()
  .description("Base for versioned, coded records about one subject row.");

/** Coded validity entity that concerns exactly one subject row. */
const CodedValiditySubjectEntityBase = dryv
  .schema({ ...subjectFields })
  .extends(codedGroup.CodedValidityEntity)
  .abstract()
  .description("Base for versioned, coded records about one subject row, valid over an optional period.");

const subjectEntityGroup = shared.schemas({
  CodedSubjectEntity: CodedSubjectEntityBase,
  CodedValiditySubjectEntity: CodedValiditySubjectEntityBase,
});

export const baseSchemas = {
  ...subjectSchemas,
  ...baseGroup,
  ...operationsGroup,
  ...operationsChildGroup,
  ...operationsLeafGroup,
  ...validityGroup,
  ...historicalGroup,
  ...codedGroup,
  ...subjectEntityGroup,
};
