import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { PlaceEntryDto } from "#/modules/geography/schema/dto/place-entry.dto.ts";

/**
 * Place At Point
 */
export class PlaceAtPointDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceEntryDto)
  places!: PlaceEntryDto[];
}
