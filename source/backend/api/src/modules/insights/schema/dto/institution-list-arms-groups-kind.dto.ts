import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Institution List Arms Groups Kind
 */
export class InstitutionListArmsGroupsKindDto {
  @IsString()
  code!: String;

  @IsString()
  label!: String;
}
