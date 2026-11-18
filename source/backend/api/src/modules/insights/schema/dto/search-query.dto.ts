import { IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import type { Limit } from "#/modules/insights/schema/type/limit.type.ts";
import type { Text } from "#/modules/insights/schema/type/text.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Search Query
 */
export class SearchQueryDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  kinds?: NonEmptyString500;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  languageCode?: NonEmptyString100;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  limit?: Limit;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  query!: Text;
}
