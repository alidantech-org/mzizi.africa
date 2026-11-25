import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { CurrencyEntryDto } from "#/modules/reference/schema/dto/currency-entry.dto.ts";

/**
 * Currency Collection
 */
export class CurrencyCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CurrencyEntryDto)
  currencies!: CurrencyEntryDto[];
}
