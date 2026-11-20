import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import type { LanguageCode } from "#/modules/explorer/schema/type/language-code.type.ts";
import type { Limit } from "#/modules/explorer/schema/type/limit.type.ts";
import type { Query } from "#/modules/explorer/schema/type/query.type.ts";
import type { IsoAlpha2 } from "#/modules/reference/schema/type/iso-alpha2.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * Search Input
 */
export class SearchInputDto {
  @IsString()
  @Length(2, 2)
  @Matches(new RegExp("^[A-Z]{2}$"))
  countryCode!: IsoAlpha2;

  @IsOptional()
  @IsInt()
  @Min(0)
  depth?: NonNegativeInteger;

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
  @IsUUID()
  parentFeatureId?: Id;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  query!: Query;
}
