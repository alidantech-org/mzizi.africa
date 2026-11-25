import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import { IdentityKind } from "#/modules/shared/schema/enum/identity-kind.enum.ts";
import { Aggregation } from "#/modules/statistics/schema/enum/aggregation.enum.ts";
import { Frequency } from "#/modules/statistics/schema/enum/frequency.enum.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Decimals } from "#/modules/statistics/schema/type/decimals.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * The concept measured (Population). Its names and short definitions are `identity.names`. (entity)
 */
export class IndicatorsDto {
  @IsEnum(Aggregation)
  aggregation!: Aggregation;

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
  @ValidateIf((object) => object.decimals !== null)
  @IsInt()
  @Min(0)
  @Max(10)
  decimals?: Decimals | null;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.frequency !== null)
  @IsEnum(Frequency)
  frequency?: Frequency | null;

  @IsOptional()
  @ValidateIf((object) => object.higherIsBetter !== null)
  @IsBoolean()
  higherIsBetter?: Flag | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsEnum(IdentityKind)
  @Satisfies<IndicatorsDto>((object) => object.identityKind === "indicator", {
    message: "Indicator Kind",
  })
  identityKind!: IdentityKind;

  @IsBoolean()
  isDerived!: Flag;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @IsOptional()
  @ValidateIf((object) => object.roleTerm !== null)
  @IsString()
  @IsUUID()
  roleTerm?: Id | null;

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
