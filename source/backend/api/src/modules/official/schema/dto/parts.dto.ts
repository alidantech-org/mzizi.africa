import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import { NamePart } from "#/modules/official/schema/enum/name-part.enum.ts";
import { IdentityKind } from "#/modules/shared/schema/enum/identity-kind.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * The parts of a person's name (given, family), for sorting and formal display. (entity)
 */
export class PartsDto {
  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  nameId!: Id;

  @IsEnum(IdentityKind)
  nameKind!: IdentityKind;

  @IsEnum(NamePart)
  part!: NamePart;

  @IsInt()
  @Min(0)
  position!: NonNegativeInteger;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  text!: NonEmptyString255;
}
