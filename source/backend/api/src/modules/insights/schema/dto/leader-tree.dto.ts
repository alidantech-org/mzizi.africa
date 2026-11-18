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
 * Leader Tree
 */
export class LeaderTreeDto {
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsArray()
  @Allow()
  levels!: Record<string, unknown>[];

  @IsOptional()
  @ValidateIf((object) => object.place !== null)
  @ValidateNested()
  @Type(() => PlaceCrumbDto)
  place?: PlaceCrumbDto | null;
}
