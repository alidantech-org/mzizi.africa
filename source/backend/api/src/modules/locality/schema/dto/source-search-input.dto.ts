import { IsInt, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";

/**
 * Source Search Input
 */
export class SourceSearchInputDto {
  @IsOptional()
  @IsInt()
  limit?: Integer;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  query?: NonEmptyString100;
}
