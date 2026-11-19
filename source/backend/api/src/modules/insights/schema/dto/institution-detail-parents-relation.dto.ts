import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Institution Detail Parents Relation
 */
export class InstitutionDetailParentsRelationDto {
  @IsString()
  code!: String;

  @IsString()
  label!: String;
}
