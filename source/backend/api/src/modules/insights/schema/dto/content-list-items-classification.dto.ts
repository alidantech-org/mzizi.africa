import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Content List Items Classification
 */
export class ContentListItemsClassificationDto {
  @IsString()
  code!: String;

  @IsString()
  label!: String;
}
