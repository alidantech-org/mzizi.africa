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

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import { DatePrecision } from "#/modules/shared/schema/enum/date-precision.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A typed, dated directed relationship between features; separate rows allow overlapping administrative, electoral, statistical and other systems. (entity)
 */
export class RelationshipsDto {
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
  @ValidateIf((object) => object.fromToPrecision !== null)
  @IsEnum(DatePrecision)
  fromToPrecision?: DatePrecision | null;

  @IsOptional()
  @ValidateIf((object) => object.fromYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  @Satisfies<RelationshipsDto>(
    (object) =>
      object.fromYear == null || object.toYear == null || object.fromYear <= object.toYear,
    {
      message: "Period Years Are Ordered",
    },
  )
  fromYear?: Year | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  objectFeatureId!: Id;

  @IsString()
  @IsUUID()
  relationshipKindId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.startsOn !== null)
  @IsISO8601({ strict: true })
  @Satisfies<RelationshipsDto>(
    (object) =>
      object.startsOn == null || object.endsOn == null || object.startsOn <= object.endsOn,
    {
      message: "Relationships Dates Are Ordered",
    },
  )
  startsOn?: CalendarDate | null;

  @IsString()
  @IsUUID()
  @Satisfies<RelationshipsDto>((object) => object.subjectFeatureId !== object.objectFeatureId, {
    message: "Relationship Must Not Be Self Referential",
  })
  subjectFeatureId!: Id;

  @IsString()
  @IsUUID()
  systemId!: Id;

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
