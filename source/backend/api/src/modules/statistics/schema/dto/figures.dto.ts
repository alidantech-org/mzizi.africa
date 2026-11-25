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
import { FigureBasis } from "#/modules/shared/schema/enum/figure-basis.enum.ts";
import { FigureStatus } from "#/modules/shared/schema/enum/figure-status.enum.ts";
import type { Cell } from "#/modules/shared/schema/type/cell.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Prepared: the one value to show per indicator or metric, place, subject, period and cell; refreshed after every load. (entity)
 *
 * Invariant "FigureHasOneMeasure" has no simple form, so it isn't validated here.
 */
export class FiguresDto {
  @IsEnum(FigureBasis)
  basis!: FigureBasis;

  @IsString()
  @MaxLength(1000)
  cell!: Cell;

  @IsString()
  @IsUUID()
  countryId!: Id;

  @IsISO8601({})
  createdAt!: Instant;

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
  fromYear?: Year | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.indicatorId !== null)
  @IsString()
  @IsUUID()
  indicatorId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.lower !== null)
  @IsNumber({})
  lower?: Number | null;

  @IsOptional()
  @ValidateIf((object) => object.metricId !== null)
  @IsString()
  @IsUUID()
  metricId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.observationId !== null)
  @IsString()
  @IsUUID()
  observationId?: Id | null;

  @IsISO8601({})
  refreshedAt!: Instant;

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
  @ValidateIf((object) => object.toYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  toYear?: Year | null;

  @IsOptional()
  @ValidateIf((object) => object.upper !== null)
  @IsNumber({})
  upper?: Number | null;

  @IsOptional()
  @ValidateIf((object) => object.value !== null)
  @IsNumber({})
  value?: Number | null;
}
