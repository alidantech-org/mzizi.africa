
import {
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import type { Id } from "#/modules/shared/id.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Url } from "#/modules/shared/url.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/**
 * API channel with named credential binding only; request behavior is pinned in manifest releases. (entity)
 */
export class ApisDto {

  @IsString()
  @IsUrl()
  @MaxLength(2048)
  baseUrl!: Url;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.credentialBinding !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  credentialBinding?: NonEmptyString255 | null;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  sourceId!: Id;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}