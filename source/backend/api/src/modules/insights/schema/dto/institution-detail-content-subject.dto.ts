import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Institution Detail Content Subject
 */
export class InstitutionDetailContentSubjectDto {
  @IsString()
  code!: String;

  @IsString()
  table!: String;
}
