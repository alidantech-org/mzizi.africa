import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Institution Detail Content Front Matter
 */
export class InstitutionDetailContentFrontMatterDto {
  @IsString()
  image!: String;
}
