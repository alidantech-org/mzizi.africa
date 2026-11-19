import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import type { Code } from "#/modules/insights/schema/type/code.type.ts";

/**
 * Law Input
 */
export class LawInputDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  kindCode?: Code;
}
