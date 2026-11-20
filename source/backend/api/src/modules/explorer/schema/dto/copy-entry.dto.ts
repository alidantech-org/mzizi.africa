import { IsString, MaxLength, MinLength } from "class-validator";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";

/**
 * Copy Entry
 */
export class CopyEntryDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  key!: NonEmptyString255;

  @IsString()
  @MaxLength(4000)
  text!: Description;
}
