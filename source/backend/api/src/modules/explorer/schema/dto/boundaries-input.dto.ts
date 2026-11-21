import {
  IsEnum,
  IsInt,
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
import { BoundaryMode } from "#/modules/explorer/schema/enum/boundary-mode.enum.ts";
import type { LanguageCode } from "#/modules/explorer/schema/type/language-code.type.ts";
import type { Limit } from "#/modules/explorer/schema/type/limit.type.ts";
import type { Path } from "#/modules/explorer/schema/type/path.type.ts";
import type { SimplifyDegrees } from "#/modules/explorer/schema/type/simplify-degrees.type.ts";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";

/**
 * Boundaries Input
 */
export class BoundariesInputDto {
  @IsString()
  @Length(2, 2)
  @Matches(new RegExp("^[A-Z]{2}$"))
  countryCode!: IsoAlpha2;

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
  @IsEnum(BoundaryMode)
  mode?: BoundaryMode;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(1500)
  path?: Path;

  @IsOptional()
  @IsNumber({})
  @Min(0)
  @Max(2)
  simplify?: SimplifyDegrees;
}
