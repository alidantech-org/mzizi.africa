import { IsOptional, IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Content List Items Front Matter
 */
export class ContentListItemsFrontMatterDto {
  @IsOptional()
  @IsString()
  image?: String;
}
