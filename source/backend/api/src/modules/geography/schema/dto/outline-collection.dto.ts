import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { OutlineEntryDto } from "#/modules/geography/schema/dto/outline-entry.dto.ts";

/**
 * Outline Collection
 */
export class OutlineCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => OutlineEntryDto)
  outlines!: OutlineEntryDto[];
}
