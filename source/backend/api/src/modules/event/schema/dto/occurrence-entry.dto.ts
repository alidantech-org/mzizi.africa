import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsISO8601,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { OccurrenceEntryNamesDto } from "#/modules/event/schema/dto/occurrence-entry-names.dto.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Occurrence Entry
 */
export class OccurrenceEntryDto {
  @ValidateIf((object) => object.actualStartsOn !== null)
  @IsISO8601({ strict: true })
  actualStartsOn!: CalendarDate | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  eventCode!: IdentityCode;

  @IsString()
  @IsUUID()
  eventId!: Id;

  @ValidateIf((object) => object.featureId !== null)
  @IsString()
  @IsUUID()
  featureId!: Id | null;

  @IsBoolean()
  isAllDay!: Flag;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => OccurrenceEntryNamesDto)
  names!: OccurrenceEntryNamesDto[];

  @IsString()
  @IsUUID()
  occurrenceId!: Id;

  @ValidateIf((object) => object.plannedEndsOn !== null)
  @IsISO8601({ strict: true })
  plannedEndsOn!: CalendarDate | null;

  @IsISO8601({ strict: true })
  plannedStartsOn!: CalendarDate;

  @ValidateIf((object) => object.startsAt !== null)
  @IsISO8601({})
  startsAt!: Instant | null;

  @IsString()
  @IsUUID()
  statusTerm!: Id;
}
