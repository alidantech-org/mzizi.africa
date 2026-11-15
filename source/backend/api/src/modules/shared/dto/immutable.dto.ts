
import {
  IsString,
  IsUUID,
} from "class-validator";
import type { Id } from "#/modules/shared/type/id.type.ts";

/**
 * Base for append-only operational records: identity written once.
 */
export class ImmutableDto {

  @IsString()
  @IsUUID()
  id!: Id;
}