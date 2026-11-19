import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Institution Detail Institution Basis
 */
export class InstitutionDetailInstitutionBasisDto {
  @IsString()
  code!: String;

  @IsString()
  label!: String;
}
