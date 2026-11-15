
import {
  IsString,
  IsUUID,
} from "class-validator";

import type { Id } from "#/modules/shared/id.type.ts";

/**
 * Role included in a delegation. (entity)
 */
export class DelegationRolesDto {

  @IsString()
  @IsUUID()
  delegationId!: Id;

  @IsString()
  @IsUUID()
  roleId!: Id;
}