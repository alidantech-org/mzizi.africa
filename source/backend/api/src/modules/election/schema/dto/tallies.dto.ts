import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateIf,
} from "class-validator";
import { FigureBasis } from "#/modules/shared/schema/enum/figure-basis.enum.ts";
import { FigureStatus } from "#/modules/shared/schema/enum/figure-status.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { Percentage } from "#/modules/shared/schema/type/percentage.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Prepared: the one result to show per contest, option and place, chosen by the country's priorities (IEBC first). (entity)
 *
 * Invariant "TallyHasOneOption" has no simple form, so it isn't validated here.
 */
export class TalliesDto {
  @IsEnum(FigureBasis)
  basis!: FigureBasis;

  @IsOptional()
  @ValidateIf((object) => object.candidateId !== null)
  @IsString()
  @IsUUID()
  candidateId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.choiceId !== null)
  @IsString()
  @IsUUID()
  choiceId?: Id | null;

  @IsString()
  @IsUUID()
  contestId!: Id;

  @IsString()
  @IsUUID()
  countryId!: Id;

  @IsISO8601({})
  createdAt!: Instant;

  @IsString()
  @IsUUID()
  featureId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsISO8601({})
  refreshedAt!: Instant;

  @IsString()
  @IsUUID()
  resultId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.share !== null)
  @IsNumber({})
  @Min(0)
  @Max(100)
  share?: Percentage | null;

  @IsEnum(FigureStatus)
  status!: FigureStatus;

  @IsOptional()
  @ValidateIf((object) => object.votes !== null)
  @IsInt()
  @Min(0)
  votes?: NonNegativeInteger | null;
}
