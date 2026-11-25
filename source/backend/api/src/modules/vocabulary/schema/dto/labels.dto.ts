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

import { LabelKind } from "#/modules/vocabulary/schema/enum/label-kind.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Every word for a term or scheme, per language and optional country. Labels have no dates; a changed meaning is a new term. (entity)
 *
 * Invariant "LabelsOneOwner" has no simple form, so it isn't validated here.
 */
export class LabelsDto {
  @IsOptional()
  @ValidateIf((object) => object.countryId !== null)
  @IsString()
  @IsUUID()
  countryId?: Id | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsEnum(LabelKind)
  kind!: LabelKind;

  @IsString()
  @IsUUID()
  languageId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.schemeId !== null)
  @IsString()
  @IsUUID()
  schemeId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.termId !== null)
  @IsString()
  @IsUUID()
  termId?: Id | null;

  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  text!: NonEmptyString1000;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
