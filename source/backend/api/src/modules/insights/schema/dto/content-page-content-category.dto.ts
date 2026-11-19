import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Content Page Content Category
 */
export class ContentPageContentCategoryDto {
  @IsString()
  code!: String;

  @IsString()
  label!: String;
}
