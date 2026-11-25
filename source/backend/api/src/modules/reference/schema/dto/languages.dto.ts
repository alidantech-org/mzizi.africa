import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import { IdentityKind } from "#/modules/shared/schema/enum/identity-kind.enum.ts";
import type { Glottocode } from "#/modules/reference/schema/type/glottocode.type.ts";
import type { Iso6391 } from "#/modules/reference/schema/type/iso6391.type.ts";
import type { Iso6393 } from "#/modules/reference/schema/type/iso6393.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * The language registry. Every text in the database points here; `und`, `mul` and `zxx` say what a missing language cannot, and a missing language never means English. (entity)
 */
export class LanguagesDto {
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
  @ValidateIf((object) => object.directionTerm !== null)
  @IsString()
  @IsUUID()
  directionTerm?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.familyTerm !== null)
  @IsString()
  @IsUUID()
  familyTerm?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.glottocode !== null)
  @IsString()
  @Length(8, 8)
  @Matches(new RegExp("^[a-z]{4}[0-9]{4}$"))
  glottocode?: Glottocode | null;

  @IsString()
  @IsUUID()
  @Satisfies<LanguagesDto>((object) => object.id !== object.parentId, {
    message: "Language Is Not Its Own Parent",
  })
  id!: Id;

  @IsEnum(IdentityKind)
  @Satisfies<LanguagesDto>((object) => object.identityKind === "language", {
    message: "Language Kind",
  })
  identityKind!: IdentityKind;

  @IsOptional()
  @ValidateIf((object) => object.iso6391 !== null)
  @IsString()
  @Length(2, 2)
  @Matches(new RegExp("^[a-z]{2}$"))
  iso6391?: Iso6391 | null;

  @IsOptional()
  @ValidateIf((object) => object.iso6392 !== null)
  @IsString()
  @Length(3, 3)
  @Matches(new RegExp("^[a-z]{3}$"))
  iso6392?: Iso6393 | null;

  @IsOptional()
  @ValidateIf((object) => object.iso6393 !== null)
  @IsString()
  @Length(3, 3)
  @Matches(new RegExp("^[a-z]{3}$"))
  iso6393?: Iso6393 | null;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @IsOptional()
  @ValidateIf((object) => object.parentId !== null)
  @IsString()
  @IsUUID()
  parentId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.scriptTerm !== null)
  @IsString()
  @IsUUID()
  scriptTerm?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;

  @IsOptional()
  @ValidateIf((object) => object.vitalityTerm !== null)
  @IsString()
  @IsUUID()
  vitalityTerm?: Id | null;
}
