
import {
  IsISO8601,
  IsString,
  IsUUID,
} from "class-validator";

import type { Id } from "#/modules/shared/type/id.type.ts";
import type { Instant } from "#/modules/shared/type/instant.type.ts";

/**
 * Base for operational records: identity, creation time and last-change time.
 */
export class TimestampedDto {

  @IsISO8601({})
  createdAt!: Instant;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsISO8601({})
  updatedAt!: Instant;
}