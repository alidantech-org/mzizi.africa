import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { LocalityUnitDto } from "#/modules/locality/schema/dto/locality-unit.dto.ts";

/**
 * Locality Matches
 */
export class LocalityMatchesDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => LocalityUnitDto)
  places!: LocalityUnitDto[];
}
