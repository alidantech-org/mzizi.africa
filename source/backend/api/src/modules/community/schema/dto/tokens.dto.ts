import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import { PushProvider } from "#/modules/community/schema/enum/push-provider.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString1000 } from "#/modules/shared/schema/type/non-empty-string1000.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A push notification token of a device. (entity)
 */
export class TokensDto {
  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  deviceId!: Id;

  @IsISO8601({})
  enabledAt!: Instant;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsEnum(PushProvider)
  provider!: PushProvider;

  @IsOptional()
  @ValidateIf((object) => object.revokedAt !== null)
  @IsISO8601({})
  revokedAt?: Instant | null;

  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  token!: NonEmptyString1000;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
