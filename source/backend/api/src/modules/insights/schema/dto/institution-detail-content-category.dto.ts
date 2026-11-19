import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Institution Detail Content Category
 */
export class InstitutionDetailContentCategoryDto {
  @IsString()
  code!: String;

  @IsString()
  label!: String;
}
