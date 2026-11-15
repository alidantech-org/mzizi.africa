
import {
  IsString,
  IsUUID,
} from "class-validator";
import type { Id } from "#/modules/shared/id.type.ts";

/**
 * Base for operational records: identity only.
 */
export class IdentifiedDto {

  @IsString()
  @IsUUID()
  id!: Id;
}