
import {
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
} from "class-validator";
import type { Id } from "#/modules/shared/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/**
 * One tag assignment to exactly one typed file or folder target. (entity)
 *
 * Invariant "ExactlyOneTarget" has no simple form, so it isn't validated here.
 */
export class TaggingsDto {

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.fileId !== null)
  @IsString()
  @IsUUID()
  fileId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.folderId !== null)
  @IsString()
  @IsUUID()
  folderId?: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  tagId!: Id;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}