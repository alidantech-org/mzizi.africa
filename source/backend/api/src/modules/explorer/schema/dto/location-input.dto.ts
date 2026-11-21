import {
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import type { LanguageCode } from "#/modules/explorer/schema/type/language-code.type.ts";
import type { Limit } from "#/modules/explorer/schema/type/limit.type.ts";
import type { Path } from "#/modules/explorer/schema/type/path.type.ts";
import type { Query } from "#/modules/explorer/schema/type/query.type.ts";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * Location Input
 */
export class LocationInputDto {
  @IsString()
  @Length(2, 2)
  @Matches(new RegExp("^[A-Z]{2}$"))
  countryCode!: IsoAlpha2;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  find?: Query;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  kindCode?: NonEmptyString255;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(35)
  languageCode?: LanguageCode;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: Limit;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: PositiveInteger;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(1500)
  path?: Path;
}
