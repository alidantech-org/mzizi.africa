import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { CompareOptionsHierarchyDto } from "#/modules/insights/schema/dto/compare-options-hierarchy.dto.ts";
import { CompareOptionsMetricsDto } from "#/modules/insights/schema/dto/compare-options-metrics.dto.ts";
import { CompareOptionsNearbyDto } from "#/modules/insights/schema/dto/compare-options-nearby.dto.ts";
import { CompareOptionsPlaceDto } from "#/modules/insights/schema/dto/compare-options-place.dto.ts";
import { CompareOptionsTopDto } from "#/modules/insights/schema/dto/compare-options-top.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Compare Options
 */
export class CompareOptionsDto {
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CompareOptionsHierarchyDto)
  hierarchy!: CompareOptionsHierarchyDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CompareOptionsMetricsDto)
  metrics!: CompareOptionsMetricsDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CompareOptionsNearbyDto)
  nearby!: CompareOptionsNearbyDto[];

  @IsDefined()
  @ValidateNested()
  @Type(() => CompareOptionsPlaceDto)
  place!: CompareOptionsPlaceDto;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CompareOptionsTopDto)
  top!: CompareOptionsTopDto[];
}
