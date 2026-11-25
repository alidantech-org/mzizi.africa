import { IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import type { Host } from "#/modules/frontend/schema/type/host.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/**
 * Home Request
 */
export class HomeRequestDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(253)
  host?: Host;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  lang?: IdentityCode;
}
