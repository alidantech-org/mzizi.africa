import { IsString, Matches, MaxLength, MinLength } from "class-validator";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/**
 * Party Key
 */
export class PartyKeyDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;
}
