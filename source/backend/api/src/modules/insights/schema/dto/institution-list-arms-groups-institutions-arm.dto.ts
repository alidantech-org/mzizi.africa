import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Institution List Arms Groups Institutions Arm
 */
export class InstitutionListArmsGroupsInstitutionsArmDto {
  @IsString()
  code!: String;

  @IsString()
  label!: String;
}
