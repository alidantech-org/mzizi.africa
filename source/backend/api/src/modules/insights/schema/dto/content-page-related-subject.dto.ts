import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Content Page Related Subject
 */
export class ContentPageRelatedSubjectDto {
  @IsString()
  code!: String;

  @IsString()
  table!: String;
}
