import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import { Retention } from "#/modules/filesystem/schema/enum/retention.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Stable logical file identity; equal content hashes may belong to different files. (entity)
 */
export class FilesDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(new RegExp("^[a-z0-9]+(-[a-z0-9]+)*(\\.[a-z0-9]+(-[a-z0-9]+)*){0,15}$"))
  code!: IdentityCode;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.currentVersionId !== null)
  @IsString()
  @IsUUID()
  currentVersionId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  folderId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  name!: Name;

  @IsEnum(Retention)
  retention!: Retention;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
