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

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import type { Note } from "#/modules/event/schema/type/note.type.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * One step of a schedule. (entity)
 */
export class ItemsDto {
  @IsBoolean()
  countsWorkingDays!: Flag;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  eventId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsOptional()
  @ValidateIf((object) => object.note !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  @Satisfies<ItemsDto>((object) => object.note == null || object.noteLanguageId != null, {
    message: "Item Note Has Language",
  })
  note?: Note | null;

  @IsOptional()
  @ValidateIf((object) => object.noteLanguageId !== null)
  @IsString()
  @IsUUID()
  noteLanguageId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.occurrenceId !== null)
  @IsString()
  @IsUUID()
  occurrenceId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.offsetDays !== null)
  @IsInt()
  offsetDays?: Integer | null;

  @IsInt()
  @Min(0)
  position!: NonNegativeInteger;

  @IsString()
  @IsUUID()
  scheduleId!: Id;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
