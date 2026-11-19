import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Institution List Arms Groups Institutions Basis
 */
export class InstitutionListArmsGroupsInstitutionsBasisDto {
  @IsString()
  code!: String;

  @IsString()
  label!: String;
}
