import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Institution Detail Institution Parent
 */
export class InstitutionDetailInstitutionParentDto {
  @IsString()
  code!: String;

  @IsString()
  name!: String;
}
