import { IsString, Matches, MaxLength, MinLength } from "class-validator";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/**
 * Scheme Key
 */
export class SchemeKeyDto {
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
