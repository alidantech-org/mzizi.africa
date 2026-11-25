import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateIf,
} from "class-validator";
import { AppointmentStep } from "#/modules/governance/schema/enum/appointment-step.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One step that put a holder in office; appointments by Parliament or a board are recorded like those by a person. (entity)
 */
export class AppointmentsDto {
  @IsOptional()
  @ValidateIf((object) => object.actorHolderId !== null)
  @IsString()
  @IsUUID()
  actorHolderId?: Id | null;

  @IsString()
  @IsUUID()
  actorId!: Id;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.fromYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  fromYear?: Year | null;

  @IsString()
  @IsUUID()
  holderId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.motionId !== null)
  @IsString()
  @IsUUID()
  motionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.onDate !== null)
  @IsISO8601({ strict: true })
  onDate?: CalendarDate | null;

  @IsEnum(AppointmentStep)
  step!: AppointmentStep;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
