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

import { FigureStatus } from "#/modules/shared/schema/enum/figure-status.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Registered and cast votes of a contest in one place, by revision. (entity)
 */
export class TurnoutsDto {
  @IsOptional()
  @ValidateIf((object) => object.cast !== null)
  @IsInt()
  @Min(0)
  cast?: NonNegativeInteger | null;

  @IsOptional()
  @ValidateIf((object) => object.collectionId !== null)
  @IsString()
  @IsUUID()
  collectionId?: Id | null;

  @IsString()
  @IsUUID()
  contestId!: Id;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  featureId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.registered !== null)
  @IsInt()
  @Min(0)
  registered?: NonNegativeInteger | null;

  @IsOptional()
  @ValidateIf((object) => object.rejected !== null)
  @IsInt()
  @Min(0)
  rejected?: NonNegativeInteger | null;

  @IsInt()
  @Min(1)
  revision!: PositiveInteger;

  @IsOptional()
  @ValidateIf((object) => object.spoilt !== null)
  @IsInt()
  @Min(0)
  spoilt?: NonNegativeInteger | null;

  @IsEnum(FigureStatus)
  status!: FigureStatus;

  @IsOptional()
  @ValidateIf((object) => object.supersedesId !== null)
  @IsString()
  @IsUUID()
  supersedesId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.valid !== null)
  @IsInt()
  @Min(0)
  valid?: NonNegativeInteger | null;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
