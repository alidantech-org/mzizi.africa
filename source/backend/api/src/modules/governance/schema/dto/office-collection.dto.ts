import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { OfficeEntryDto } from "#/modules/governance/schema/dto/office-entry.dto.ts";

/**
 * Office Collection
 */
export class OfficeCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => OfficeEntryDto)
  offices!: OfficeEntryDto[];
}
