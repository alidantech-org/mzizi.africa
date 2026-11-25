import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import { IdentityKind } from "#/modules/shared/schema/enum/identity-kind.enum.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A figure calculated from indicators (a rate per 1,000); computed when `figures` is refreshed. (entity)
 */
export class MetricsDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.denominatorId !== null)
  @IsString()
  @IsUUID()
  denominatorId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.higherIsBetter !== null)
  @IsBoolean()
  higherIsBetter?: Flag | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsEnum(IdentityKind)
  @Satisfies<MetricsDto>((object) => object.identityKind === "metric", {
    message: "Metric Kind",
  })
  identityKind!: IdentityKind;

  @IsBoolean()
  isRankable!: Flag;

  @IsOptional()
  @ValidateIf((object) => object.levelTerm !== null)
  @IsString()
  @IsUUID()
  levelTerm?: Id | null;

  @IsString()
  @IsUUID()
  numeratorId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.perFactor !== null)
  @IsNumber({})
  perFactor?: Number | null;

  @IsString()
  @IsUUID()
  topicTerm!: Id;

  @IsOptional()
  @ValidateIf((object) => object.unitId !== null)
  @IsString()
  @IsUUID()
  unitId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
