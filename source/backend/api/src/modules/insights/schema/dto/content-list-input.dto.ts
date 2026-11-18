import { IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import type { Code } from "#/modules/insights/schema/type/code.type.ts";
import type { Limit } from "#/modules/insights/schema/type/limit.type.ts";
import type { Text } from "#/modules/insights/schema/type/text.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";

/**
 * Content List Input
 */
export class ContentListInputDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  category?: Code;

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

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  query?: Text;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  tag?: Code;
}
