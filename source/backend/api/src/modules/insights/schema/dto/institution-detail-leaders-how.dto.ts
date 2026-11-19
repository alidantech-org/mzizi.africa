import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Institution Detail Leaders How
 */
export class InstitutionDetailLeadersHowDto {
  @IsString()
  code!: String;

  @IsString()
  label!: String;
}
