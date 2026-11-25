import type { AppointmentStep } from "#/modules/governance/schema/enum/appointment-step.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/** Office Detail Holders Steps */
export interface OfficeDetailHoldersSteps {
  actorCode: IdentityCode;
  actorHolderId: Id | null;
  actorId: Id;
  motionId: Id | null;
  onDate: CalendarDate | null;
  step: AppointmentStep;
}
