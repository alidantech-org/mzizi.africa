import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Content Page Content Subject
 */
export class ContentPageContentSubjectDto {
  @IsString()
  code!: String;

  @IsString()
  table!: String;
}
