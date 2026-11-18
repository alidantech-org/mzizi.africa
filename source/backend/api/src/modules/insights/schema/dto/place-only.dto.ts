import { IsString, IsUUID } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/**
 * Place Only
 */
export class PlaceOnlyDto {
  @IsString()
  @IsUUID()
  featureId!: Id;
}
