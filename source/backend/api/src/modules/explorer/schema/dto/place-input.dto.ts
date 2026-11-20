import {
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import type { LanguageCode } from "#/modules/explorer/schema/type/language-code.type.ts";
import type { Path } from "#/modules/explorer/schema/type/path.type.ts";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/**
 * Place Input
 */
export class PlaceInputDto {
  @IsString()
  @Length(2, 2)
  @Matches(new RegExp("^[A-Z]{2}$"))
  countryCode!: IsoAlpha2;

  @IsOptional()
  @IsString()
  @IsUUID()
  featureId?: Id;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(35)
  languageCode?: LanguageCode;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(1500)
  path?: Path;
}
