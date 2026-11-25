import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsNumber,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import { FigureBasis } from "#/modules/shared/schema/enum/figure-basis.enum.ts";
import { FigureStatus } from "#/modules/shared/schema/enum/figure-status.enum.ts";
import type { Cell } from "#/modules/shared/schema/type/cell.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Figure Entry
 */
export class FigureEntryDto {
  @IsEnum(FigureBasis)
  basis!: FigureBasis;

  @IsString()
  @MaxLength(1000)
  cell!: Cell;

  @ValidateIf((object) => object.endsOn !== null)
  @IsISO8601({ strict: true })
  endsOn!: CalendarDate | null;

  @IsString()
  @IsUUID()
  featureId!: Id;

  @IsString()
  @IsUUID()
  figureId!: Id;

  @ValidateIf((object) => object.fromYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  fromYear!: Year | null;

  @ValidateIf((object) => object.indicatorCode !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  indicatorCode!: IdentityCode | null;

  @ValidateIf((object) => object.indicatorId !== null)
  @IsString()
  @IsUUID()
  indicatorId!: Id | null;

  @ValidateIf((object) => object.lower !== null)
  @IsNumber({})
  lower!: Number | null;

  @ValidateIf((object) => object.metricId !== null)
  @IsString()
  @IsUUID()
  metricId!: Id | null;

  @ValidateIf((object) => object.observationId !== null)
  @IsString()
  @IsUUID()
  observationId!: Id | null;

  @IsISO8601({})
  refreshedAt!: Instant;

  @ValidateIf((object) => object.startsOn !== null)
  @IsISO8601({ strict: true })
  startsOn!: CalendarDate | null;

  @IsEnum(FigureStatus)
  status!: FigureStatus;

  @ValidateIf((object) => object.subjectId !== null)
  @IsString()
  @IsUUID()
  subjectId!: Id | null;

  @ValidateIf((object) => object.toYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  toYear!: Year | null;

  @ValidateIf((object) => object.upper !== null)
  @IsNumber({})
  upper!: Number | null;

  @ValidateIf((object) => object.value !== null)
  @IsNumber({})
  value!: Number | null;
}
