import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import { FigureBasis } from "#/modules/shared/schema/enum/figure-basis.enum.ts";
import { FigureStatus } from "#/modules/shared/schema/enum/figure-status.enum.ts";
import type { Cell } from "#/modules/shared/schema/type/cell.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One published figure for an indicator, place, subject, period and breakdown cell, by collection and revision. (entity)
 */
export class ObservationsDto {
  @IsEnum(FigureBasis)
  basis!: FigureBasis;

  @IsString()
  @MaxLength(1000)
  cell!: Cell;

  @IsOptional()
  @ValidateIf((object) => object.collectionId !== null)
  @IsString()
  @IsUUID()
  collectionId?: Id | null;

  @IsString()
  @IsUUID()
  countryId!: Id;

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

  @IsString()
  @IsUUID()
  featureId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.fromYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  @Satisfies<ObservationsDto>(
    (object) =>
      object.fromYear == null || object.toYear == null || object.fromYear <= object.toYear,
    {
      message: "Observation Period Is Ordered",
    },
  )
  fromYear?: Year | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  indicatorId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.lower !== null)
  @IsNumber({})
  @Satisfies<ObservationsDto>(
    (object) => object.lower == null || object.upper == null || object.lower <= object.upper,
    {
      message: "Bounds Are Ordered",
    },
  )
  lower?: Number | null;

  @IsInt()
  @Min(1)
  revision!: PositiveInteger;

  @IsOptional()
  @ValidateIf((object) => object.startsOn !== null)
  @IsISO8601({ strict: true })
  startsOn?: CalendarDate | null;

  @IsEnum(FigureStatus)
  status!: FigureStatus;

  @IsOptional()
  @ValidateIf((object) => object.subjectId !== null)
  @IsString()
  @IsUUID()
  subjectId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.supersedesId !== null)
  @IsString()
  @IsUUID()
  supersedesId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.toYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  toYear?: Year | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.upper !== null)
  @IsNumber({})
  upper?: Number | null;

  @IsOptional()
  @ValidateIf((object) => object.value !== null)
  @IsNumber({})
  value?: Number | null;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
