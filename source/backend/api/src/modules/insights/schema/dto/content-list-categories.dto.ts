import { IsNumber, IsString } from "class-validator";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Content List Categories
 */
export class ContentListCategoriesDto {
  @IsString()
  code!: String;

  @IsNumber({})
  count!: Number;

  @IsString()
  label!: String;
}
