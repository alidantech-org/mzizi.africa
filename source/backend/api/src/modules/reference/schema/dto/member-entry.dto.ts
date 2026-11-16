import { IsString, IsUUID, Matches, MaxLength, MinLength, ValidateIf } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";

/**
 * Member Entry
 */
export class MemberEntryDto {
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

  @ValidateIf((object) => object.supersedesId !== null)
  @IsString()
  @IsUUID()
  supersedesId!: Id | null;
}
