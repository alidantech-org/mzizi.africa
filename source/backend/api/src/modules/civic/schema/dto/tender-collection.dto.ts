import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { TenderEntryDto } from "#/modules/civic/schema/dto/tender-entry.dto.ts";

/**
 * Tender Collection
 */
export class TenderCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => TenderEntryDto)
  tenders!: TenderEntryDto[];
}
