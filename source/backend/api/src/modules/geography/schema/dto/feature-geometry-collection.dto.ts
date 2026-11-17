import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { FeatureGeometryDto } from "#/modules/geography/schema/dto/feature-geometry.dto.ts";

/**
 * Feature Geometry Collection
 */
export class FeatureGeometryCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => FeatureGeometryDto)
  geometries!: FeatureGeometryDto[];
}
