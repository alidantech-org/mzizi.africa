import {
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
import type { Glottocode } from "#/modules/reference/schema/type/glottocode.type.ts";
import type { Iso6391 } from "#/modules/reference/schema/type/iso6391.type.ts";
import type { Iso6392 } from "#/modules/reference/schema/type/iso6392.type.ts";
import type { Iso6393 } from "#/modules/reference/schema/type/iso6393.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A language, macrolanguage, variety or one of the special no-language codes, with its ISO 639 and Glottolog identifiers and its classification as scheme values. (entity)
 */
export class LanguageDto {
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
  @ValidateIf((object) => object.directionId !== null)
  @IsString()
  @IsUUID()
  directionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.familyId !== null)
  @IsString()
  @IsUUID()
  familyId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.glottocode !== null)
  @IsString()
  @Length(8, 8)
  @Matches(new RegExp("^[a-z]{4}[0-9]{4}$"))
  glottocode?: Glottocode | null;

  @IsString()
  @IsUUID()
  @Satisfies<LanguageDto>((object) => object.id !== object.parentId, {
    message: "Language Is Not Its Own Parent",
  })
  id!: Id;

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
  iso6392?: Iso6392 | null;

  @IsOptional()
  @ValidateIf((object) => object.iso6393 !== null)
  @IsString()
  @Length(3, 3)
  @Matches(new RegExp("^[a-z]{3}$"))
  iso6393?: Iso6393 | null;

  @IsString()
  @IsUUID()
  kindId!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;

  @IsOptional()
  @ValidateIf((object) => object.parentId !== null)
  @IsString()
  @IsUUID()
  parentId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.scriptId !== null)
  @IsString()
  @IsUUID()
  scriptId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.statusId !== null)
  @IsString()
  @IsUUID()
  statusId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
