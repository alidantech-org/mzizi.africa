import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Institution Detail Children Relation
 */
export class InstitutionDetailChildrenRelationDto {
  @IsString()
  code!: String;

  @IsString()
  label!: String;
}
