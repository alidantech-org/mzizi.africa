import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { UnitEntryDto } from "#/modules/reference/schema/dto/unit-entry.dto.ts";

/**
 * Unit Collection
 */
export class UnitCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => UnitEntryDto)
  units!: UnitEntryDto[];
}
