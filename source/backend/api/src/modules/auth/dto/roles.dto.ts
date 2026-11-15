
import {
  IsBoolean,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import type { Description } from "#/modules/shared/description.type.ts";
import type { Flag } from "#/modules/shared/flag.type.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/non-empty-string255.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/**
 * Named permission bundle with a policy version; protected roles cannot be edited away. (entity)
 */
export class RolesDto {

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(new RegExp("^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$"))
  code!: IdentityCode;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.description !== null)
  @IsString()
  @MaxLength(4000)
  description?: Description | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.managingInstitutionRefId !== null)
  @IsString()
  @IsUUID()
  managingInstitutionRefId?: Id | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  policyVersion!: NonEmptyString255;

  @IsBoolean()
  protected!: Flag;

  @IsOptional()
  @ValidateIf((object) => object.retiredAt !== null)
  @IsISO8601({})
  retiredAt?: Instant | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title!: NonEmptyString255;
}