import type { SubjectTable } from "#/modules/shared/schema/enum/subject-table.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/** Base for versioned, coded records about one subject row, with a period of integer years. */
export interface CodedPeriodSubjectEntity {
  code: IdentityCode;
  createdAt: Instant;
  deletedAt?: Instant | null;
  fromYear?: Year | null;
  id: Id;
  subjectId: Id;
  subjectTable: SubjectTable;
  toYear?: Year | null;
  updatedAt: Instant;
  version: PositiveInteger;
}
