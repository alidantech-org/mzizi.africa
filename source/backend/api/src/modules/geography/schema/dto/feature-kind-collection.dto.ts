import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { FeatureKindDto } from "#/modules/geography/schema/dto/feature-kind.dto.ts";

/**
 * Feature Kind Collection
 */
export class FeatureKindCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => FeatureKindDto)
  kinds!: FeatureKindDto[];
}
