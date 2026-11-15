
import {
  IsString,
  IsUUID,
} from "class-validator";
import type { Id } from "#/modules/shared/id.type.ts";

/**
 * Office Key
 */
export class OfficeKeyDto {

  @IsString()
  @IsUUID()
  officeId!: Id;
}