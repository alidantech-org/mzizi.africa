import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import type { Code } from "#/modules/insights/schema/type/code.type.ts";
import type { Text } from "#/modules/insights/schema/type/text.type.ts";

/**
 * Institutions Input
 */
export class InstitutionsInputDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  armCode?: Code;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  kindCode?: Code;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  query?: Text;
}
