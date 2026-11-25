import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { InstrumentEntryDto } from "#/modules/legal/schema/dto/instrument-entry.dto.ts";

/**
 * Instrument Collection
 */
export class InstrumentCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => InstrumentEntryDto)
  instruments!: InstrumentEntryDto[];
}
