
import {
  IsISO8601,
  IsString,
  IsUUID,
} from "class-validator";

import type { Id } from "#/modules/shared/type/id.type.ts";
import type { Instant } from "#/modules/shared/type/instant.type.ts";

/**
 * Permission granted to a role, with who granted it and when. (entity)
 */
export class RolePermissionsDto {

  @IsISO8601({})
  grantedAt!: Instant;

  @IsString()
  @IsUUID()
  grantedBy!: Id;

  @IsString()
  @IsUUID()
  permissionId!: Id;

  @IsString()
  @IsUUID()
  roleId!: Id;
}