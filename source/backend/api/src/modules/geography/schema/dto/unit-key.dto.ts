import { IsString, IsUUID } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/**
 * Unit Key
 */
export class UnitKeyDto {
  @IsString()
  @IsUUID()
  featureId!: Id;
}
