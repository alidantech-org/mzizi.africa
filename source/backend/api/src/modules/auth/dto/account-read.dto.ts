
import {
  IsEnum,
  IsISO8601,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import { AccountStatus } from "#/modules/auth/account-status.enum.ts";
import { AuthActorKind } from "#/modules/auth/auth-actor-kind.enum.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/non-empty-string255.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/**
 * Account Read
 */
export class AccountReadDto {

  @IsEnum(AuthActorKind)
  actorKind!: AuthActorKind;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  displayName!: NonEmptyString255;

  @IsString()
  @IsUUID()
  id!: Id;

  @ValidateIf((object) => object.lastAuthenticatedAt !== null)
  @IsISO8601({})
  lastAuthenticatedAt!: Instant | null;

  @IsEnum(AccountStatus)
  status!: AccountStatus;
}