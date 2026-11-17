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

  @IsOptional()
  @ValidateIf((object) => object.fromToPrecision !== null)
  @IsEnum(DatePrecision)
  fromToPrecision?: DatePrecision | null;

  @IsOptional()
  @ValidateIf((object) => object.fromYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  @Satisfies<ClassificationsDto>(
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

  @IsOptional()
  @ValidateIf((object) => object.toYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  toYear?: Year | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsString()
  @IsUUID()
  valueId!: Id;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
