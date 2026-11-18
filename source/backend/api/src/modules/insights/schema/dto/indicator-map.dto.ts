import { Type } from "class-transformer";
import {
  Allow,
  IsArray,
  IsISO8601,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { PlaceCrumbDto } from "#/modules/insights/schema/dto/place-crumb.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/**
 * Indicator Map
 */
export class IndicatorMapDto {
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @Allow()
  indicator!: Record<string, unknown>;

  @IsOptional()
  @ValidateIf((object) => object.parent !== null)
  @ValidateNested()
  @Type(() => PlaceCrumbDto)
  parent?: PlaceCrumbDto | null;

  @IsOptional()
  @ValidateIf((object) => object.periodFrom !== null)
  @IsISO8601({ strict: true })
  periodFrom?: CalendarDate | null;

  @IsArray()
  @Allow()
  units!: Record<string, unknown>[];
}
