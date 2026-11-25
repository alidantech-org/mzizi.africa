import { IsString, IsUUID } from "class-validator";

import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/**
 * The security ceiling of a delegation: the roles a delegate may receive through it. (entity)
 */
export class AllowancesDto {
  @IsString()
  @IsUUID()
  delegationId!: Id;

  @IsString()
  @IsUUID()
  roleId!: Id;
}
