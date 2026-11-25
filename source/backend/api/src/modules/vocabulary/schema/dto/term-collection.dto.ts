import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { TermEntryDto } from "#/modules/vocabulary/schema/dto/term-entry.dto.ts";

/**
 * Term Collection
 */
export class TermCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => TermEntryDto)
  terms!: TermEntryDto[];
}
