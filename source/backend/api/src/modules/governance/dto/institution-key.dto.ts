
import {
  IsString,
  IsUUID,
} from "class-validator";
import type { Id } from "#/modules/shared/id.type.ts";

/**
 * Institution Key
 */
export class InstitutionKeyDto {

  @IsString()
  @IsUUID()
  institutionId!: Id;
}