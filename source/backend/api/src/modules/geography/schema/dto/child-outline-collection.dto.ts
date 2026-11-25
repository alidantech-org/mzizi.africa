import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { ChildOutlineEntryDto } from "#/modules/geography/schema/dto/child-outline-entry.dto.ts";

/**
 * Child Outline Collection
 */
export class ChildOutlineCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ChildOutlineEntryDto)
  children!: ChildOutlineEntryDto[];
}
