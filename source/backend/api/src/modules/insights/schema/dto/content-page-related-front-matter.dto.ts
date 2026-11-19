import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Content Page Related Front Matter
 */
export class ContentPageRelatedFrontMatterDto {
  @IsString()
  citationId!: String;

  @IsString()
  parent!: String;
}
