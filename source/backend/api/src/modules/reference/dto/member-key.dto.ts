
import {
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";

/**
 * Member Key
 */
export class MemberKeyDto {

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(new RegExp("^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$"))
  code!: IdentityCode;
}