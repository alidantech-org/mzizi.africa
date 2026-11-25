import {
  IsEnum,
  IsISO8601,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import { AppointmentStep } from "#/modules/governance/schema/enum/appointment-step.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/**
 * Office Detail Holders Steps
 */
export class OfficeDetailHoldersStepsDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  actorCode!: IdentityCode;

  @ValidateIf((object) => object.actorHolderId !== null)
  @IsString()
  @IsUUID()
  actorHolderId!: Id | null;

  @IsString()
  @IsUUID()
  actorId!: Id;

  @ValidateIf((object) => object.motionId !== null)
  @IsString()
  @IsUUID()
  motionId!: Id | null;

  @ValidateIf((object) => object.onDate !== null)
  @IsISO8601({ strict: true })
  onDate!: CalendarDate | null;

  @IsEnum(AppointmentStep)
  step!: AppointmentStep;
}
