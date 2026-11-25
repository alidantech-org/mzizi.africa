import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { PowerEntryDto } from "#/modules/governance/schema/dto/power-entry.dto.ts";

/**
 * Power Collection
 */
export class PowerCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PowerEntryDto)
  powers!: PowerEntryDto[];
}
