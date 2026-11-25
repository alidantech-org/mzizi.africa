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

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import { LoginKind } from "#/modules/auth/schema/enum/login-kind.enum.ts";
import type { LoginValue } from "#/modules/auth/schema/type/login-value.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A way an account signs in: email or phone with one-time codes, or an OIDC issuer and subject. (entity)
 *
 * Invariant "OidcLoginHasIssuer" has no simple form, so it isn't validated here.
 */
export class LoginsDto {
  @IsString()
  @IsUUID()
  accountId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.issuer !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  issuer?: NonEmptyString500 | null;

  @IsEnum(LoginKind)
  @Satisfies<LoginsDto>((object) => object.kind === "oidc" || object.value != null, {
    message: "Code Login Has Value",
  })
  kind!: LoginKind;

  @IsOptional()
  @ValidateIf((object) => object.lastAuthenticatedAt !== null)
  @IsISO8601({})
  lastAuthenticatedAt?: Instant | null;

  @IsISO8601({})
  linkedAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.subject !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  subject?: NonEmptyString500 | null;

  @IsOptional()
  @ValidateIf((object) => object.unlinkedAt !== null)
  @IsISO8601({})
  unlinkedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.value !== null)
  @IsString()
  @MinLength(3)
  @MaxLength(320)
  value?: LoginValue | null;

  @IsOptional()
  @ValidateIf((object) => object.verifiedAt !== null)
  @IsISO8601({})
  verifiedAt?: Instant | null;
}
