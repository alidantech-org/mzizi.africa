import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { FindingEntryDto } from "#/modules/finance/schema/dto/finding-entry.dto.ts";

/**
 * Finding Collection
 */
export class FindingCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => FindingEntryDto)
  findings!: FindingEntryDto[];
}
