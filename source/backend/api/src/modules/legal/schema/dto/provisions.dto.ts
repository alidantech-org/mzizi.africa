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

import { ProvisionKind } from "#/modules/legal/schema/enum/provision-kind.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * Stable provision identity within one instrument; hierarchy stays within that instrument. One provision holds one statement. (entity)
 */
export class ProvisionsDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  designation!: NonEmptyString255;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  instrumentId!: Id;

  @IsEnum(ProvisionKind)
  kind!: ProvisionKind;

  @IsOptional()
  @ValidateIf((object) => object.parentId !== null)
  @IsString()
  @IsUUID()
  parentId?: Id | null;

  @IsInt()
  @Min(1)
  position!: PositiveInteger;

  @IsOptional()
  @ValidateIf((object) => object.title !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  title?: Name | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
