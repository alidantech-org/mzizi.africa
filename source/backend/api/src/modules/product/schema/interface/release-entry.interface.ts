import type { ReleaseStatus } from "#/modules/product/schema/enum/release-status.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Release Entry */
export interface ReleaseEntry {
  appCode: IdentityCode;
  countryCode: IdentityCode;
  countryId: Id;
  fromOn: CalendarDate | null;
  releaseId: Id;
  status: ReleaseStatus;
}
