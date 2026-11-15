
import {
  IsISO8601,
  IsString,
  IsUUID,
} from "class-validator";

import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Base for operational records: identity and creation time.
 */
export class CreatedDto {

  @IsISO8601({})
  createdAt!: Instant;

  @IsString()
  @IsUUID()
  id!: Id;
}