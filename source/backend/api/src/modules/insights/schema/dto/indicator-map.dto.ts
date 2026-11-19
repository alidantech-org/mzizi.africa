import { Type } from "class-transformer";
import {
  IsArray,
  IsISO8601,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { IndicatorMapIndicatorDto } from "#/modules/insights/schema/dto/indicator-map-indicator.dto.ts";
import { IndicatorMapUnitsDto } from "#/modules/insights/schema/dto/indicator-map-units.dto.ts";
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

  @IsDefined()
  @ValidateNested()
  @Type(() => IndicatorMapIndicatorDto)
  indicator!: IndicatorMapIndicatorDto;

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
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => IndicatorMapUnitsDto)
  units!: IndicatorMapUnitsDto[];
}
