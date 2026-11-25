import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
} from "class-validator";
import { FigureBasis } from "#/modules/shared/schema/enum/figure-basis.enum.ts";
import { FigureStatus } from "#/modules/shared/schema/enum/figure-status.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Votes for exactly one candidate or one choice in one place, by collection and revision. (entity)
 *
 * Invariant "ResultHasOneOption" has no simple form, so it isn't validated here.
 */
export class ResultsDto {
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

  @IsOptional()
  @ValidateIf((object) => object.collectionId !== null)
  @IsString()
  @IsUUID()
  collectionId?: Id | null;

  @IsString()
  @IsUUID()
  countryId!: Id;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  featureId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.formId !== null)
  @IsString()
  @IsUUID()
  formId?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsInt()
  @Min(1)
  revision!: PositiveInteger;

  @IsEnum(FigureStatus)
  status!: FigureStatus;

  @IsOptional()
  @ValidateIf((object) => object.supersedesId !== null)
  @IsString()
  @IsUUID()
  supersedesId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;

  @IsOptional()
  @ValidateIf((object) => object.votes !== null)
  @IsInt()
  @Min(0)
  votes?: NonNegativeInteger | null;
}
