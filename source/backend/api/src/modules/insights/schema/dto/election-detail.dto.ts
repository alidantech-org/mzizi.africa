import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { ElectionDetailContestsDto } from "#/modules/insights/schema/dto/election-detail-contests.dto.ts";
import { ElectionDetailElectionDto } from "#/modules/insights/schema/dto/election-detail-election.dto.ts";
import { ElectionDetailTotalsDto } from "#/modules/insights/schema/dto/election-detail-totals.dto.ts";
import { ElectionDetailUnitsDto } from "#/modules/insights/schema/dto/election-detail-units.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Election Detail
 */
export class ElectionDetailDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ElectionDetailContestsDto)
  contests!: ElectionDetailContestsDto[];

  @IsDefined()
  @ValidateNested()
  @Type(() => ElectionDetailElectionDto)
  election!: ElectionDetailElectionDto;

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ElectionDetailTotalsDto)
  totals!: ElectionDetailTotalsDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ElectionDetailUnitsDto)
  units!: ElectionDetailUnitsDto[];
}
