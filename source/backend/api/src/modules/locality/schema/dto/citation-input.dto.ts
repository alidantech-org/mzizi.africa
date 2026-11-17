import { IsString, IsUUID } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/**
 * Citation Input
 */
export class CitationInputDto {
  @IsString()
  @IsUUID()
  citationId!: Id;
}
