import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, ValidateIf, ValidateNested } from "class-validator";
import { ElectionListElectionsRunnerUpDto } from "#/modules/insights/schema/dto/election-list-elections-runner-up.dto.ts";
import { ElectionListElectionsWinnerDto } from "#/modules/insights/schema/dto/election-list-elections-winner.dto.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Election List Elections
 */
export class ElectionListElectionsDto {
  @IsString()
  code!: String;

  @IsNumber({})
  contests!: Number;

  @IsString()
  electionId!: String;

  @IsString()
  heldOn!: String;

  @IsString()
  kind!: String;

  @IsOptional()
  @ValidateIf((object) => object.registeredVoters !== null)
  @IsNumber({})
  registeredVoters?: Number | null;

  @IsOptional()
  @ValidateIf((object) => object.runnerUp !== null)
  @ValidateNested()
  @Type(() => ElectionListElectionsRunnerUpDto)
  runnerUp?: ElectionListElectionsRunnerUpDto | null;

  @IsOptional()
  @ValidateIf((object) => object.validVotes !== null)
  @IsNumber({})
  validVotes?: Number | null;

  @IsOptional()
  @ValidateIf((object) => object.winner !== null)
  @ValidateNested()
  @Type(() => ElectionListElectionsWinnerDto)
  winner?: ElectionListElectionsWinnerDto | null;

  @IsNumber({})
  year!: Number;
}
