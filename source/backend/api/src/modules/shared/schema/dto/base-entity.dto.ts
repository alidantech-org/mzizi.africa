import { IsInt, IsISO8601, IsString, IsUUID, Min } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { DateTime } from "#/modules/shared/schema/type/date-time.type.ts";

/**
 * Base Entity
 */
export class BaseEntityDto {
  @IsISO8601({})
  createdAt!: DateTime;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsISO8601({})
  updatedAt!: DateTime;

  @IsInt()
  @Min(0)
  version!: NonNegativeInteger;
}
