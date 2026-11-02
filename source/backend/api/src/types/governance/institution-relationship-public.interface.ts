
import type { RelationshipKind } from "#/types/governance/relationship-kind.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Institution } from "#/types/governance/institution.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Institution Relationship Public */
export interface InstitutionRelationshipPublic {
  childInstitutionId: Id;
  createdAt: DateTime;
  id: Id;
  isCurrent: Flag;
  kind: RelationshipKind;
  legalBasisId?: Id | null;
  parentInstitutionId: Id;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  version: Version;
}