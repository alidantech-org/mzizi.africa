import { Type } from "class-transformer";
import {
  Allow,
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { PlaceCrumbDto } from "#/modules/insights/schema/dto/place-crumb.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Indicator Series
 */
export class IndicatorSeriesDto {
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @Allow()
  indicator!: Record<string, unknown>;

  @IsDefined()
  @ValidateNested()
  @Type(() => PlaceCrumbDto)
  place!: PlaceCrumbDto;

  @IsArray()
  @Allow()
  points!: Record<string, unknown>[];
}
