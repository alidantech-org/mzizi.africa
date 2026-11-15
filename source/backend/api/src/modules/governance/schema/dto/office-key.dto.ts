import { IsString, IsUUID } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/**
 * Office Key
 */
export class OfficeKeyDto {
  @IsString()
  @IsUUID()
  officeId!: Id;
}
