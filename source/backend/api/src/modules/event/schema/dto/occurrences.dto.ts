import {
  IsBoolean,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One happening of an event, with planned and actual dates. (entity)
 */
export class OccurrencesDto {
  @IsOptional()
  @ValidateIf((object) => object.actualEndsOn !== null)
  @IsISO8601({ strict: true })
  actualEndsOn?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.actualStartsOn !== null)
  @IsISO8601({ strict: true })
  @Satisfies<OccurrencesDto>(
    (object) =>
      object.actualStartsOn == null ||
      object.actualEndsOn == null ||
      object.actualStartsOn <= object.actualEndsOn,
    {
      message: "Actual Dates Are Ordered",
    },
  )
  actualStartsOn?: CalendarDate | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @IsOptional()
  @ValidateIf((object) => object.continuesOccurrenceId !== null)
  @IsString()
  @IsUUID()
  continuesOccurrenceId?: Id | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  eventId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.formatTerm !== null)
  @IsString()
  @IsUUID()
  formatTerm?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsBoolean()
  isAllDay!: Flag;

  @IsString()
  @IsUUID()
  knowledgeTerm!: Id;

  @IsOptional()
  @ValidateIf((object) => object.organiserId !== null)
  @IsString()
  @IsUUID()
  organiserId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.plannedEndsOn !== null)
  @IsISO8601({ strict: true })
  plannedEndsOn?: CalendarDate | null;

  @IsISO8601({ strict: true })
  @Satisfies<OccurrencesDto>(
    (object) =>
      object.plannedStartsOn == null ||
      object.plannedEndsOn == null ||
      object.plannedStartsOn <= object.plannedEndsOn,
    {
      message: "Planned Dates Are Ordered",
    },
  )
  plannedStartsOn!: CalendarDate;

  @IsOptional()
  @ValidateIf((object) => object.startsAt !== null)
  @IsISO8601({})
  startsAt?: Instant | null;

  @IsString()
  @IsUUID()
  statusTerm!: Id;

  @IsOptional()
  @ValidateIf((object) => object.timezoneId !== null)
  @IsString()
  @IsUUID()
  timezoneId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
