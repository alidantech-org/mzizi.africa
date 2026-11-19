import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Institution Detail Institution Kind
 */
export class InstitutionDetailInstitutionKindDto {
  @IsString()
  code!: String;

  @IsString()
  label!: String;
}
