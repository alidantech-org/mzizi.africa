import {
  IsEnum,
  IsInt,
  IsISO8601,
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
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A kind of seat that law creates (Governor, Member of County Assembly). Its titles are `identity.names`. (entity)
 */
export class PositionsDto {
  @IsOptional()
  @ValidateIf((object) => object.basisTerm !== null)
  @IsString()
  @IsUUID()
  basisTerm?: Id | null;

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
  @ValidateIf((object) => object.exposureTerm !== null)
  @IsString()
  @IsUUID()
  exposureTerm?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsEnum(IdentityKind)
  @Satisfies<PositionsDto>((object) => object.identityKind === "position", {
    message: "Position Kind",
  })
  identityKind!: IdentityKind;

  @IsOptional()
  @ValidateIf((object) => object.institutionId !== null)
  @IsString()
  @IsUUID()
  institutionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.levelId !== null)
  @IsString()
  @IsUUID()
  levelId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.methodTerm !== null)
  @IsString()
  @IsUUID()
  methodTerm?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.position !== null)
  @IsInt()
  @Min(0)
  position?: NonNegativeInteger | null;

  @IsOptional()
  @ValidateIf((object) => object.provisionId !== null)
  @IsString()
  @IsUUID()
  provisionId?: Id | null;

  @IsString()
  @IsUUID()
  roleTerm!: Id;

  @IsOptional()
  @ValidateIf((object) => object.seatCount !== null)
  @IsInt()
  @Min(1)
  seatCount?: PositiveInteger | null;

  @IsOptional()
  @ValidateIf((object) => object.seatLevelId !== null)
  @IsString()
  @IsUUID()
  seatLevelId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.termLimit !== null)
  @IsInt()
  @Min(1)
  termLimit?: PositiveInteger | null;

  @IsOptional()
  @ValidateIf((object) => object.termYears !== null)
  @IsInt()
  @Min(1)
  termYears?: PositiveInteger | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
