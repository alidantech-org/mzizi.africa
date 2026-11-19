import { IsBoolean, IsNumber, IsString } from "class-validator";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Place Elections Elections Contests Candidates
 */
export class PlaceElectionsElectionsContestsCandidatesDto {
  @IsString()
  individualId!: String;

  @IsString()
  name!: String;

  @IsString()
  party!: String;

  @IsString()
  partyCode!: String;

  @IsNumber({})
  share!: Number;

  @IsNumber({})
  votes!: Number;

  @IsBoolean()
  won!: Flag;
}
