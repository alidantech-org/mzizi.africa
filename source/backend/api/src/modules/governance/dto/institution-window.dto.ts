
import {
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import type { IdentityCode } from "#/modules/shared/type/identity-code.type.ts";
import type { Integer } from "#/modules/shared/type/integer.type.ts";

/**
 * Institution Window
 */
export class InstitutionWindowDto {

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(new RegExp("^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$"))
  codePrefix?: IdentityCode;

  @IsOptional()
  @IsInt()
  limit?: Integer;

  @IsOptional()
  @IsInt()
  offset?: Integer;
}