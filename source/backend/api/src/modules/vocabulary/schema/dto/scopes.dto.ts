import { IsEnum, IsISO8601, IsOptional, IsString, IsUUID, ValidateIf } from "class-validator";

import { IdentityKind } from "#/modules/shared/schema/enum/identity-kind.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Which kinds of named thing a scheme may classify. (entity)
 */
export class ScopesDto {
  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsEnum(IdentityKind)
  identityKind!: IdentityKind;

  @IsString()
  @IsUUID()
  schemeId!: Id;
}
