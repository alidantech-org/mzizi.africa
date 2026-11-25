import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { PartyEntryDto } from "#/modules/politics/schema/dto/party-entry.dto.ts";

/**
 * Party Collection
 */
export class PartyCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PartyEntryDto)
  parties!: PartyEntryDto[];
}
