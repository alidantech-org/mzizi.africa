import { Type } from "class-transformer";
import { IsBoolean, IsOptional, IsString, ValidateIf, ValidateNested } from "class-validator";
import { CompareOptionsHierarchyUnitDto } from "#/modules/insights/schema/dto/compare-options-hierarchy-unit.dto.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Compare Options Hierarchy
 */
export class CompareOptionsHierarchyDto {
  @IsBoolean()
  available!: Flag;

  @IsString()
  label!: String;

  @IsOptional()
  @ValidateIf((object) => object.message !== null)
  @IsString()
  message?: String | null;

  @IsString()
  rung!: String;

  @IsOptional()
  @ValidateIf((object) => object.unit !== null)
  @ValidateNested()
  @Type(() => CompareOptionsHierarchyUnitDto)
  unit?: CompareOptionsHierarchyUnitDto | null;
}
