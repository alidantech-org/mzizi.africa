import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { HierarchyEntryDto } from "#/modules/reference/schema/dto/hierarchy-entry.dto.ts";

/**
 * Hierarchy Collection
 */
export class HierarchyCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => HierarchyEntryDto)
  hierarchies!: HierarchyEntryDto[];
}
