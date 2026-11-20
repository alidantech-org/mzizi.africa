import {
  IsInt,
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
import type { LanguageCode } from "#/modules/explorer/schema/type/language-code.type.ts";
import type { Path } from "#/modules/explorer/schema/type/path.type.ts";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/**
 * Place
 */
export class PlaceDto {
  @IsString()
  @MinLength(1)
  @MaxLength(1500)
  canonicalPath!: Path;

  @IsInt()
  @Min(0)
  citationCount!: NonNegativeInteger;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  code!: NonEmptyString255;

  @IsString()
  @Length(2, 2)
  @Matches(new RegExp("^[A-Z]{2}$"))
  countryCode!: IsoAlpha2;

  @IsInt()
  @Min(0)
  depth!: NonNegativeInteger;

  @IsString()
  @IsUUID()
  featureId!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  kind!: Name;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;

  @IsOptional()
  @ValidateIf((object) => object.nameLanguage !== null)
  @IsString()
  @MinLength(2)
  @MaxLength(35)
  nameLanguage?: LanguageCode | null;

  @IsOptional()
  @ValidateIf((object) => object.parentFeatureId !== null)
  @IsString()
  @IsUUID()
  parentFeatureId?: Id | null;
}
