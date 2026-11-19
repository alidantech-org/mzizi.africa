import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Institution Detail Institution Arm
 */
export class InstitutionDetailInstitutionArmDto {
  @IsString()
  code!: String;

  @IsString()
  label!: String;
}
