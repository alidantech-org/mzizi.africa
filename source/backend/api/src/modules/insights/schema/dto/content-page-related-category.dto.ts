import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Content Page Related Category
 */
export class ContentPageRelatedCategoryDto {
  @IsString()
  code!: String;

  @IsString()
  label!: String;
}
