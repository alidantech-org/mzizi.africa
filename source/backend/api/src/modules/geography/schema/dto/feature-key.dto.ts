import { IsString, IsUUID } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/**
 * Feature Key
 */
export class FeatureKeyDto {
  @IsString()
  @IsUUID()
  featureId!: Id;
}
