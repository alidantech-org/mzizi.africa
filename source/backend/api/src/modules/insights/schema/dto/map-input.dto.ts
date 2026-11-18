import { IsOptional, IsString, IsUUID, Matches, MaxLength, MinLength } from "class-validator";
import type { Code } from "#/modules/insights/schema/type/code.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/**
 * Map Input
 */
export class MapInputDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  indicatorCode!: Code;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  kindCode?: IdentityCode;

  @IsOptional()
  @IsString()
  @IsUUID()
  parentFeatureId?: Id;
}
