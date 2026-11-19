import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Content List Items Category
 */
export class ContentListItemsCategoryDto {
  @IsString()
  code!: String;

  @IsString()
  label!: String;
}
