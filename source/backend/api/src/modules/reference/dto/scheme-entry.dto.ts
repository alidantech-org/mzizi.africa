
import {
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/type/name.type.ts";

/**
 * Scheme Entry
 */
export class SchemeEntryDto {

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(new RegExp("^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$"))
  code!: IdentityCode;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  title!: Name;
}