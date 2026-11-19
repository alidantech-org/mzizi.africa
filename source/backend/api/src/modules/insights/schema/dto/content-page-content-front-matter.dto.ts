import { IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Content Page Content Front Matter
 */
export class ContentPageContentFrontMatterDto {
  @IsString()
  citationId!: String;
}
