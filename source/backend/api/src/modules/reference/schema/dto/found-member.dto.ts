import { IsString, IsUUID, Matches, MaxLength, MinLength } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";

/**
 * Found Member
 */
export class FoundMemberDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(new RegExp("^[a-z0-9]+(-[a-z0-9]+)*(\\.[a-z0-9]+(-[a-z0-9]+)*){0,15}$"))
  code!: IdentityCode;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  label!: Name;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(new RegExp("^[a-z0-9]+(-[a-z0-9]+)*(\\.[a-z0-9]+(-[a-z0-9]+)*){0,15}$"))
  scheme!: IdentityCode;
}
