import {
  IsBoolean,
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

import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Note } from "#/modules/source/schema/type/note.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One side of a dispute. (entity)
 */
export class ContendersDto {
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  claim!: Note;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  disputeId!: Id;

  @IsString()
  @IsUUID()
  evidenceId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsBoolean()
  isPreferred!: Flag;

  @IsString()
  @IsUUID()
  languageId!: Id;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
