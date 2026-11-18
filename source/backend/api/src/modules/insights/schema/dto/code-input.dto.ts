import { IsString, MaxLength, MinLength } from "class-validator";
import type { Code } from "#/modules/insights/schema/type/code.type.ts";

/**
 * Code Input
 */
export class CodeInputDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  code!: Code;
}
