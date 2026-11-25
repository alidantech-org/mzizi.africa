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
import { AccountStatus } from "#/modules/auth/schema/enum/account-status.enum.ts";
import { AuthActorKind } from "#/modules/auth/schema/enum/auth-actor-kind.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A sign-in principal for a person, service or agent. (entity)
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
  @ValidateIf((object) => object.individualId !== null)
  @IsString()
  @IsUUID()
  individualId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.lastAuthenticatedAt !== null)
  @IsISO8601({})
  lastAuthenticatedAt?: Instant | null;

  @IsEnum(AccountStatus)
  status!: AccountStatus;
}
