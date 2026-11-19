import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Institution List Arms Groups Institutions Parent
 */
export class InstitutionListArmsGroupsInstitutionsParentDto {
  @IsString()
  code!: String;

  @IsString()
  name!: String;
}
