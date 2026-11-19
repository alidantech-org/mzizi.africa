import { Type } from "class-transformer";
import {
  IsArray,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { NearbyProjectsProjectsDto } from "#/modules/insights/schema/dto/nearby-projects-projects.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";

/**
 * Nearby Projects
 */
export class NearbyProjectsDto {
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => NearbyProjectsProjectsDto)
  projects!: NearbyProjectsProjectsDto[];

  @IsNumber({})
  radiusKm!: Number;
}
