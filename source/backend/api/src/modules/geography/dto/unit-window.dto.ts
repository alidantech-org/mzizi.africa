
import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/type/identity-code.type.ts";
import type { Integer } from "#/modules/shared/type/integer.type.ts";

/**
 * Unit Window
 */
export class UnitWindowDto {

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(new RegExp("^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$"))
  codePrefix?: IdentityCode;

  @IsOptional()
  @IsString()
  @IsUUID()
  countryId?: Id;

  @IsOptional()
  @IsInt()
  limit?: Integer;

  @IsOptional()
  @IsInt()
  offset?: Integer;
}