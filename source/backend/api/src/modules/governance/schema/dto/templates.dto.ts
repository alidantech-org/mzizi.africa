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

import { TemplateProduct } from "#/modules/governance/schema/enum/template-product.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One thing a pattern produces, how many, how it is named and coded. Templates generate structure only, never people. (entity)
 *
 * Invariant "PositionAttributesNeedPositionProduct" has no simple form, so it isn't validated here.
 *
 * Invariant "InstitutionAttributesNeedInstitutionProduct" has no simple form, so it isn't validated here.
 */
export class TemplatesDto {
  @IsOptional()
  @ValidateIf((object) => object.armTerm !== null)
  @IsString()
  @IsUUID()
  armTerm?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.basisTerm !== null)
  @IsString()
  @IsUUID()
  basisTerm?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.classTerm !== null)
  @IsString()
  @IsUUID()
  classTerm?: Id | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  codeTemplate!: NonEmptyString500;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.fanOutLevelId !== null)
  @IsString()
  @IsUUID()
  fanOutLevelId?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.kindTerm !== null)
  @IsString()
  @IsUUID()
  kindTerm?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.methodTerm !== null)
  @IsString()
  @IsUUID()
  methodTerm?: Id | null;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  nameTemplate!: NonEmptyString500;

  @IsOptional()
  @ValidateIf((object) => object.parentTemplateId !== null)
  @IsString()
  @IsUUID()
  parentTemplateId?: Id | null;

  @IsString()
  @IsUUID()
  patternId!: Id;

  @IsEnum(TemplateProduct)
  produces!: TemplateProduct;

  @IsOptional()
  @ValidateIf((object) => object.roleTerm !== null)
  @IsString()
  @IsUUID()
  roleTerm?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.seatCount !== null)
  @IsInt()
  @Min(1)
  seatCount?: PositiveInteger | null;

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
