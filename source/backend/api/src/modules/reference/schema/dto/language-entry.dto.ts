import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  IsUUID,
  Length,
  Matches,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { LanguageEntryNamesDto } from "#/modules/reference/schema/dto/language-entry-names.dto.ts";
import type { Iso6391 } from "#/modules/reference/schema/type/iso6391.type.ts";
import type { Iso6393 } from "#/modules/reference/schema/type/iso6393.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/**
 * Language Entry
 */
export class LanguageEntryDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @ValidateIf((object) => object.directionTerm !== null)
  @IsString()
  @IsUUID()
  directionTerm!: Id | null;

  @ValidateIf((object) => object.iso6391 !== null)
  @IsString()
  @Length(2, 2)
  @Matches(new RegExp("^[a-z]{2}$"))
  iso6391!: Iso6391 | null;

  @ValidateIf((object) => object.iso6393 !== null)
  @IsString()
  @Length(3, 3)
  @Matches(new RegExp("^[a-z]{3}$"))
  iso6393!: Iso6393 | null;

  @IsString()
  @IsUUID()
  languageId!: Id;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => LanguageEntryNamesDto)
  names!: LanguageEntryNamesDto[];
}
