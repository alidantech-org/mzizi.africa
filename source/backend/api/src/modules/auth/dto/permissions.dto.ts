
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import { AuthAction } from "#/modules/auth/auth-action.enum.ts";
import type { Description } from "#/modules/shared/description.type.ts";
import type { Flag } from "#/modules/shared/flag.type.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/non-empty-string255.type.ts";

/**
 * Named action on a resource type, optionally narrowed to a field group. (entity)
 */
export class PermissionsDto {

  @IsEnum(AuthAction)
  action!: AuthAction;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(new RegExp("^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$"))
  code!: IdentityCode;

  @IsOptional()
  @ValidateIf((object) => object.description !== null)
  @IsString()
  @MaxLength(4000)
  description?: Description | null;

  @IsOptional()
  @ValidateIf((object) => object.fieldGroup !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  fieldGroup?: NonEmptyString255 | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsBoolean()
  isActive!: Flag;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  resourceType!: NonEmptyString255;
}