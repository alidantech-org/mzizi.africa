import {
  IsEnum,
  IsInt,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import { IdentityKind } from "#/modules/shared/schema/enum/identity-kind.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";

/**
 * Address Match
 */
export class AddressMatchDto {
  @IsString()
  @IsUUID()
  addressId!: Id;

  @ValidateIf((object) => object.canonicalId !== null)
  @IsString()
  @IsUUID()
  canonicalId!: Id | null;

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
  @IsUUID()
  identityId!: Id;

  @IsEnum(IdentityKind)
  kind!: IdentityKind;

  @ValidateIf((object) => object.parentId !== null)
  @IsString()
  @IsUUID()
  parentId!: Id | null;

  @ValidateIf((object) => object.sectionTerm !== null)
  @IsString()
  @IsUUID()
  sectionTerm!: Id | null;

  @ValidateIf((object) => object.toYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  toYear!: Year | null;
}
