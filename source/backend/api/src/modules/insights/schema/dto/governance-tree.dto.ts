import { Type } from "class-transformer";
import {
  Allow,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { PlaceCrumbDto } from "#/modules/insights/schema/dto/place-crumb.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Governance Tree
 */
export class GovernanceTreeDto {
  @IsArray()
  @Allow()
  edges!: Record<string, unknown>[];

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsArray()
  @Allow()
  legend!: Record<string, unknown>[];

  @IsArray()
  @Allow()
  nodes!: Record<string, unknown>[];

  @IsOptional()
  @ValidateIf((object) => object.place !== null)
  @ValidateNested()
  @Type(() => PlaceCrumbDto)
  place?: PlaceCrumbDto | null;

  @IsArray()
  @Allow()
  rail!: Record<string, unknown>[];

  @Allow()
  tab!: Record<string, unknown>;
}
