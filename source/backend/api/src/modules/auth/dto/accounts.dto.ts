
import {
  IsEnum,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import { AccountStatus } from "#/modules/auth/enum/account-status.enum.ts";
import { AuthActorKind } from "#/modules/auth/enum/auth-actor-kind.enum.ts";
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/type/non-empty-string255.type.ts";
import type { Instant } from "#/modules/shared/type/instant.type.ts";

/**
 * Login principal for a person or service; identity is separate from the people and institutions it refers to. (entity)
 */
export class AccountsDto {

  @IsEnum(AuthActorKind)
  actorKind!: AuthActorKind;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.disabledAt !== null)
  @IsISO8601({})
  disabledAt?: Instant | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  displayName!: NonEmptyString255;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.lastAuthenticatedAt !== null)
  @IsISO8601({})
  lastAuthenticatedAt?: Instant | null;

  @IsString()
  @IsUUID()
  personRefId!: Id;

  @IsEnum(AccountStatus)
  status!: AccountStatus;
}