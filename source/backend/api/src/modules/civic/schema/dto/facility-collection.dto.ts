import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { FacilityEntryDto } from "#/modules/civic/schema/dto/facility-entry.dto.ts";

/**
 * Facility Collection
 */
export class FacilityCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => FacilityEntryDto)
  facilities!: FacilityEntryDto[];
}
