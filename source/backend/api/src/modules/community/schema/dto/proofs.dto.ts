import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import { LocationCheck } from "#/modules/community/schema/enum/location-check.enum.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { Percentage } from "#/modules/shared/schema/type/percentage.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A location check that a contribution was made from where it claims. (entity)
 */
export class ProofsDto {
  @IsOptional()
  @ValidateIf((object) => object.accuracyMeters !== null)
  @IsInt()
  @Min(0)
  accuracyMeters?: NonNegativeInteger | null;

  @IsString()
  @IsUUID()
  actorId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.attestationOk !== null)
  @IsBoolean()
  attestationOk?: Flag | null;

  @IsEnum(LocationCheck)
  check!: LocationCheck;

  @IsOptional()
  @ValidateIf((object) => object.coarseCell !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  coarseCell?: NonEmptyString100 | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  deviceId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.headerAgrees !== null)
  @IsBoolean()
  headerAgrees?: Flag | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.matchedFeatureId !== null)
  @IsString()
  @IsUUID()
  matchedFeatureId?: Id | null;

  @IsBoolean()
  mockLocationDetected!: Flag;

  @IsISO8601({})
  recordedAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.travelOk !== null)
  @IsBoolean()
  travelOk?: Flag | null;

  @IsNumber({})
  @Min(0)
  @Max(100)
  trustScore!: Percentage;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
