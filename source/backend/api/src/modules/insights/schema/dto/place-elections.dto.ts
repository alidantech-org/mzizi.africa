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
 * Place Elections
 */
export class PlaceElectionsDto {
  @IsArray()
  @Allow()
  elections!: Record<string, unknown>[];

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsDefined()
  @ValidateNested()
  @Type(() => PlaceCrumbDto)
  place!: PlaceCrumbDto;

  @IsArray()
  @Allow()
  registrationTrend!: Record<string, unknown>[];

  @IsArray()
  @Allow()
  turnoutTrend!: Record<string, unknown>[];
}
