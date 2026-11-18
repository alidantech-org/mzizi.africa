import { Type } from "class-transformer";
import {
  Allow,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { PlaceCrumbDto } from "#/modules/insights/schema/dto/place-crumb.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Place Civic
 */
export class PlaceCivicDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceCrumbDto)
  chain!: PlaceCrumbDto[];

  @IsArray()
  @Allow()
  classes!: Record<string, unknown>[];

  @IsOptional()
  @ValidateIf((object) => object.fund !== null)
  @Allow()
  fund?: Record<string, unknown> | null;

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @Allow()
  infrastructure!: Record<string, unknown>;

  @IsArray()
  @Allow()
  leadership!: Record<string, unknown>[];

  @IsDefined()
  @ValidateNested()
  @Type(() => PlaceCrumbDto)
  place!: PlaceCrumbDto;

  @IsArray()
  @Allow()
  projects!: Record<string, unknown>[];

  @IsArray()
  @Allow()
  years!: Record<string, unknown>[];
}
