import { IsInt, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import type { NameText } from "#/modules/identity/schema/type/name-text.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/**
 * Name Search
 */
export class NameSearchDto {
  @IsOptional()
  @IsInt()
  limit?: Integer;

  @IsOptional()
  @IsInt()
  offset?: Integer;

  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  text!: NameText;
}
