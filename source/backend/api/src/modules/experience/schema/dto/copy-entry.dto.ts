import { IsString, MaxLength, MinLength } from "class-validator";
import type { Code } from "#/modules/experience/schema/type/code.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Copy Entry
 */
export class CopyEntryDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  key!: Code;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  text!: NonEmptyString500;
}
