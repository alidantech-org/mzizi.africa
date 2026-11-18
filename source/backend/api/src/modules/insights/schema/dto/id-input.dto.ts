import { IsString, IsUUID } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/**
 * Id Input
 */
export class IdInputDto {
  @IsString()
  @IsUUID()
  id!: Id;
}
