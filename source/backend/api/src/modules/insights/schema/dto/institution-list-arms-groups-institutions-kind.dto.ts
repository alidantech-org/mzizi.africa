import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Institution List Arms Groups Institutions Kind
 */
export class InstitutionListArmsGroupsInstitutionsKindDto {
  @IsString()
  code!: String;

  @IsString()
  label!: String;
}
