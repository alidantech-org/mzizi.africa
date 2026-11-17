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

import { LanguageNameKind } from "#/modules/reference/schema/enum/language-name-kind.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A name of a language written in a language, such as Kiswahili (endonym) and Swahili (exonym). (entity)
 */
export class LanguageNameDto {
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
  inLanguageId!: Id;

  @IsString()
  @IsUUID()
  languageId!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;

  @IsEnum(LanguageNameKind)
  nameKind!: LanguageNameKind;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
