import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { CountryEntryDto } from "#/modules/reference/schema/dto/country-entry.dto.ts";

/**
 * Country Collection
 */
export class CountryCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CountryEntryDto)
  countries!: CountryEntryDto[];
}
