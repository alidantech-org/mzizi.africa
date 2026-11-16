import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { FeatureEntryDto } from "#/modules/geography/schema/dto/feature-entry.dto.ts";

/**
 * Feature Collection
 */
export class FeatureCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => FeatureEntryDto)
  features!: FeatureEntryDto[];
}
