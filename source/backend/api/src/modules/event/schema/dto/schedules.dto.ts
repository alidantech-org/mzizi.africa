import {
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
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A published plan of dated items: an election timetable, a school year, a parliamentary calendar. Items are placed by offset from an anchor, so moving the anchor moves the plan. (entity)
 */
export class SchedulesDto {
  @IsOptional()
  @ValidateIf((object) => object.anchorEventId !== null)
  @IsString()
  @IsUUID()
  anchorEventId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.anchorOn !== null)
  @IsISO8601({ strict: true })
  anchorOn?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.basisProvisionId !== null)
  @IsString()
  @IsUUID()
  basisProvisionId?: Id | null;

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
  @ValidateIf((object) => object.countryId !== null)
  @IsString()
  @IsUUID()
  countryId?: Id | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.issuerEntityId !== null)
  @IsString()
  @IsUUID()
  issuerEntityId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.publishedOn !== null)
  @IsISO8601({ strict: true })
  publishedOn?: CalendarDate | null;

  @IsString()
  @IsUUID()
  scheduleKindId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.sourceCitationId !== null)
  @IsString()
  @IsUUID()
  sourceCitationId?: Id | null;

  @IsString()
  @IsUUID()
  statusId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.supersedesScheduleId !== null)
  @IsString()
  @IsUUID()
  supersedesScheduleId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
