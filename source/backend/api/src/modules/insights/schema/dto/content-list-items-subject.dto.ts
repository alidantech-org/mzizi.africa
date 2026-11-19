import { IsOptional, IsString, ValidateIf } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Content List Items Subject
 */
export class ContentListItemsSubjectDto {
  @IsOptional()
  @ValidateIf((object) => object.code !== null)
  @IsString()
  code?: String | null;

  @IsString()
  table!: String;
}
