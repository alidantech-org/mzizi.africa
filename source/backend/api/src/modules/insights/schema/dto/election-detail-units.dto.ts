import { Type } from "class-transformer";
import {
  Allow,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { ElectionDetailUnitsCandidatesDto } from "#/modules/insights/schema/dto/election-detail-units-candidates.dto.ts";
import { ElectionDetailUnitsWinnerDto } from "#/modules/insights/schema/dto/election-detail-units-winner.dto.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Election Detail Units
 */
export class ElectionDetailUnitsDto {
  @IsNumber({})
  ballotsCast!: Number;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ElectionDetailUnitsCandidatesDto)
  candidates!: ElectionDetailUnitsCandidatesDto[];

  @IsString()
  featureId!: String;

  @IsOptional()
  @ValidateIf((object) => object.geometry !== null)
  @Allow()
  geometry?: unknown | null;

  @IsString()
  name!: String;

  @IsString()
  path!: String;

  @IsNumber({})
  registered!: Number;

  @IsNumber({})
  rejected!: Number;

  @IsNumber({})
  turnout!: Number;

  @IsNumber({})
  validVotes!: Number;

  @IsDefined()
  @ValidateNested()
  @Type(() => ElectionDetailUnitsWinnerDto)
  winner!: ElectionDetailUnitsWinnerDto;
}
