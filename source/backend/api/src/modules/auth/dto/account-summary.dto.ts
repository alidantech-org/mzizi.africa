
import {
  IsEnum,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from "class-validator";
import { AccountStatus } from "#/modules/auth/account-status.enum.ts";
import { AuthActorKind } from "#/modules/auth/auth-actor-kind.enum.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/non-empty-string255.type.ts";

/**
 * Account Summary
 */
export class AccountSummaryDto {

  @IsEnum(AuthActorKind)
  actorKind!: AuthActorKind;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  displayName!: NonEmptyString255;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsEnum(AccountStatus)
  status!: AccountStatus;
}