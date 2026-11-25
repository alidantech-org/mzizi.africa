import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { NameMatchDto } from "#/modules/identity/schema/dto/name-match.dto.ts";

/**
 * Name Matches
 */
export class NameMatchesDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => NameMatchDto)
  matches!: NameMatchDto[];
}
