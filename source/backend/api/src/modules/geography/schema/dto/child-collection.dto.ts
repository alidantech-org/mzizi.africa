import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { ChildEntryDto } from "#/modules/geography/schema/dto/child-entry.dto.ts";

/**
 * Child Collection
 */
export class ChildCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ChildEntryDto)
  children!: ChildEntryDto[];
}
