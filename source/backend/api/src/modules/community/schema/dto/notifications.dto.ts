import { IsISO8601, IsOptional, IsString, IsUUID, ValidateIf } from "class-validator";

import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A notification to send; partitioned by month of creation. (entity)
 */
export class NotificationsDto {
  @IsISO8601({})
  createdAt!: Instant;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.identityId !== null)
  @IsString()
  @IsUUID()
  identityId?: Id | null;

  @IsString()
  @IsUUID()
  keyId!: Id;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @IsOptional()
  @ValidateIf((object) => object.occurrenceId !== null)
  @IsString()
  @IsUUID()
  occurrenceId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.postCountryId !== null)
  @IsString()
  @IsUUID()
  postCountryId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.postId !== null)
  @IsString()
  @IsUUID()
  postId?: Id | null;
}
