import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Legal Basis Subject
 */
export class LegalBasisSubjectDto {
  @IsString()
  code!: String;

  @IsString()
  table!: String;
}
