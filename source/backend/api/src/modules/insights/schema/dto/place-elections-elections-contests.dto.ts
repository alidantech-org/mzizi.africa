import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, IsDefined, ValidateNested } from "class-validator";
import { PlaceElectionsElectionsContestsCandidatesDto } from "#/modules/insights/schema/dto/place-elections-elections-contests-candidates.dto.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Place Elections Elections Contests
 */
export class PlaceElectionsElectionsContestsDto {
  @IsNumber({})
  ballotsCast!: Number;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PlaceElectionsElectionsContestsCandidatesDto)
  candidates!: PlaceElectionsElectionsContestsCandidatesDto[];

  @IsString()
  kind!: String;

  @IsNumber({})
  registered!: Number;

  @IsNumber({})
  turnout!: Number;
}
