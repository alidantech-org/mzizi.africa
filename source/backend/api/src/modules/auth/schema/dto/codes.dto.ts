import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import { CodeChannel } from "#/modules/auth/schema/enum/code-channel.enum.ts";
import { CodePurpose } from "#/modules/auth/schema/enum/code-purpose.enum.ts";
import type { Attempts } from "#/modules/auth/schema/type/attempts.type.ts";
import type { LoginValue } from "#/modules/auth/schema/type/login-value.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Sha256 } from "#/modules/shared/schema/type/sha256.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A one-time sign-up or sign-in code. (entity)
 *
 * Invariant "CodeHasTarget" has no simple form, so it isn't validated here.
 */
export class CodesDto {
  @IsInt()
  @Min(0)
  @Max(100)
  attempts!: Attempts;

  @IsEnum(CodeChannel)
  channel!: CodeChannel;

  @IsOptional()
  @ValidateIf((object) => object.consumedAt !== null)
  @IsISO8601({})
  consumedAt?: Instant | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsString()
  @Length(64, 64)
  @Matches(new RegExp("^[a-f0-9]{64}$"))
  digest!: Sha256;

  @IsISO8601({})
  expiresAt!: Instant;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.loginId !== null)
  @IsString()
  @IsUUID()
  loginId?: Id | null;

  @IsEnum(CodePurpose)
  purpose!: CodePurpose;

  @IsOptional()
  @ValidateIf((object) => object.value !== null)
  @IsString()
  @MinLength(3)
  @MaxLength(320)
  value?: LoginValue | null;
}
