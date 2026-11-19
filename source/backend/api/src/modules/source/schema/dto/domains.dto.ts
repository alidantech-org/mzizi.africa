import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A host name a source is served from. A host belongs to one source at a time; its validity period records moves. (entity)
 */
export class DomainsDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.endsOn !== null)
  @IsISO8601({ strict: true })
  endsOn?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.entityId !== null)
  @IsString()
  @IsUUID()
  entityId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.fromToPrecision !== null)
  @IsEnum(DatePrecision)
  fromToPrecision?: DatePrecision | null;

  @IsOptional()
  @ValidateIf((object) => object.fromYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  @Satisfies<DomainsDto>(
    (object) =>
      object.fromYear == null || object.toYear == null || object.fromYear <= object.toYear,
    {
      message: "Period Years Are Ordered",
    },
  )
  fromYear?: Year | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  host!: NonEmptyString255;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.lastCheckedAt !== null)
  @IsISO8601({})
  lastCheckedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.officialContactId !== null)
  @IsString()
  @IsUUID()
  officialContactId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.sourceId !== null)
  @IsString()
  @IsUUID()
  sourceId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.startsOn !== null)
  @IsISO8601({ strict: true })
  @Satisfies<DomainsDto>(
    (object) =>
      object.startsOn == null || object.endsOn == null || object.startsOn <= object.endsOn,
    {
      message: "Domains Dates Are Ordered",
    },
  )
  startsOn?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.statusId !== null)
  @IsString()
  @IsUUID()
  statusId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.templateId !== null)
  @IsString()
  @IsUUID()
  templateId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.toYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  toYear?: Year | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
