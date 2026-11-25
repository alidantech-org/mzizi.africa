import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsNumber,
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
 * Tally Entry
 */
export class TallyEntryDto {
  @IsEnum(FigureBasis)
  basis!: FigureBasis;

  @ValidateIf((object) => object.candidateId !== null)
  @IsString()
  @IsUUID()
  candidateId!: Id | null;

  @ValidateIf((object) => object.choiceId !== null)
  @IsString()
  @IsUUID()
  choiceId!: Id | null;

  @IsString()
  @IsUUID()
  contestId!: Id;

  @IsISO8601({})
  refreshedAt!: Instant;

  @ValidateIf((object) => object.share !== null)
  @IsNumber({})
  @Min(0)
  @Max(100)
  share!: Percentage | null;

  @IsEnum(FigureStatus)
  status!: FigureStatus;

  @ValidateIf((object) => object.votes !== null)
  @IsInt()
  @Min(0)
  votes!: NonNegativeInteger | null;
}
