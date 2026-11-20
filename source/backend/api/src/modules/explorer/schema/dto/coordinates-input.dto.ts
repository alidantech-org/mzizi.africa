import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import type { Accuracy } from "#/modules/explorer/schema/type/accuracy.type.ts";
import type { LanguageCode } from "#/modules/explorer/schema/type/language-code.type.ts";
import type { Latitude } from "#/modules/explorer/schema/type/latitude.type.ts";
import type { Longitude } from "#/modules/explorer/schema/type/longitude.type.ts";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";

/**
 * Coordinates Input
 */
export class CoordinatesInputDto {
  @IsOptional()
  @IsNumber({})
  @Min(0)
  @Max(100000)
  accuracyMeters?: Accuracy;

  @IsOptional()
  @IsString()
  @Length(2, 2)
  @Matches(new RegExp("^[A-Z]{2}$"))
  countryCode?: IsoAlpha2;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(35)
  languageCode?: LanguageCode;

  @IsNumber({})
  @Min(-90)
  @Max(90)
  latitude!: Latitude;

  @IsNumber({})
  @Min(-180)
  @Max(180)
  longitude!: Longitude;
}
