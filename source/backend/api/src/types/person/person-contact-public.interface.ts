
import type { ContactKind } from "#/types/person/contact-kind.enum.ts";
import type { Exposure } from "#/types/person/exposure.enum.ts";
import type { DatePrecision } from "#/types/shared/date-precision.enum.ts";
import type { ContactValue } from "#/types/person/contact-value.type.ts";
import type { Flag } from "#/types/shared/flag.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { Person } from "#/types/person/person.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";
import type { Date } from "#/types/shared/date.type.ts";

/** Person Contact Public */
export interface PersonContactPublic {
  createdAt: DateTime;
  exposure: Exposure;
  id: Id;
  isCurrent: Flag;
  kind: ContactKind;
  label?: Label | null;
  officeId?: Id | null;
  personId: Id;
  updatedAt: DateTime;
  validFrom?: Date | null;
  validFromPrecision?: DatePrecision | null;
  validTo?: Date | null;
  validToPrecision?: DatePrecision | null;
  value: ContactValue;
  version: Version;
}