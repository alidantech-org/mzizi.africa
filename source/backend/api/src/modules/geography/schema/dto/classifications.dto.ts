import { IsInt, IsISO8601, IsOptional, IsString, IsUUID, Min, ValidateIf } from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One dated classification of a feature by a scheme value, so a feature can answer several classification questions and change over time. (entity)
 */
export class ClassificationsDto {
  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  featureId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.sourceId !== null)
  @IsString()
  @IsUUID()
  sourceId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.validFrom !== null)
  @IsISO8601({ strict: true })
  @Satisfies<ClassificationsDto>(
    (object) =>
      object.validFrom == null || object.validUntil == null || object.validFrom < object.validUntil,
    {
      message: "Validity Window Is Ordered",
    },
  )
  validFrom?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.validFromEarliest !== null)
  @IsISO8601({ strict: true })
  @Satisfies<ClassificationsDto>(
    (object) =>
      object.validFromEarliest == null ||
      object.validFromLatest == null ||
      object.validFromEarliest < object.validFromLatest,
    {
      message: "Start Bounds Are Ordered",
    },
  )
  validFromEarliest?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.validFromLatest !== null)
  @IsISO8601({ strict: true })
  validFromLatest?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.validUntil !== null)
  @IsISO8601({ strict: true })
  validUntil?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.validUntilEarliest !== null)
  @IsISO8601({ strict: true })
  @Satisfies<ClassificationsDto>(
    (object) =>
      object.validUntilEarliest == null ||
      object.validUntilLatest == null ||
      object.validUntilEarliest < object.validUntilLatest,
    {
      message: "End Bounds Are Ordered",
    },
  )
  validUntilEarliest?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.validUntilLatest !== null)
  @IsISO8601({ strict: true })
  validUntilLatest?: CalendarDate | null;

  @IsString()
  @IsUUID()
  valueId!: Id;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
