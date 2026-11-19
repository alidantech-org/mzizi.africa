import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Institution Detail Leaders Unit
 */
export class InstitutionDetailLeadersUnitDto {
  @IsString()
  featureId!: String;

  @IsString()
  name!: String;
}
