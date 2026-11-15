
import {
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
import type { Description } from "#/modules/shared/type/description.type.ts";
import type { Id } from "#/modules/shared/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/type/identity-code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/type/non-empty-string100.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/type/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/type/instant.type.ts";

/**
 * Technical filename suffix and media-type hint; never a semantic document classification. (entity)
 */
export class FileExtensionsDto {

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(new RegExp("^[a-z0-9][a-z0-9_]*(\\.[a-z0-9][a-z0-9_]*){0,15}$"))
  code!: IdentityCode;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  contentType!: NonEmptyString255;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.description !== null)
  @IsString()
  @MaxLength(4000)
  description?: Description | null;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  extension!: NonEmptyString100;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}