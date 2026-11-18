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
 * Place Statistics
 */
export class PlaceStatisticsDto {
  @Allow()
  breakdowns!: Record<string, unknown>;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceCrumbDto)
  chain!: PlaceCrumbDto[];

  @IsArray()
  @Allow()
  comparisons!: Record<string, unknown>[];

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsDefined()
  @ValidateNested()
  @Type(() => PlaceCrumbDto)
  place!: PlaceCrumbDto;

  @Allow()
  siblings!: Record<string, unknown>;

  @IsArray()
  @Allow()
  topics!: Record<string, unknown>[];
}
