import {
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
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A postponement, cancellation or move of an occurrence. (entity)
 */
export class ChangesDto {
  @IsOptional()
  @ValidateIf((object) => object.authorityId !== null)
  @IsString()
  @IsUUID()
  authorityId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.basisProvisionId !== null)
  @IsString()
  @IsUUID()
  basisProvisionId?: Id | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.decidedOn !== null)
  @IsISO8601({ strict: true })
  decidedOn?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsOptional()
  @ValidateIf((object) => object.fromOn !== null)
  @IsISO8601({ strict: true })
  fromOn?: CalendarDate | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @IsOptional()
  @ValidateIf((object) => object.note !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  @Satisfies<ChangesDto>((object) => object.note == null || object.noteLanguageId != null, {
    message: "Change Note Has Language",
  })
  note?: Note | null;

  @IsOptional()
  @ValidateIf((object) => object.noteLanguageId !== null)
  @IsString()
  @IsUUID()
  noteLanguageId?: Id | null;

  @IsString()
  @IsUUID()
  occurrenceId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.reasonTerm !== null)
  @IsString()
  @IsUUID()
  reasonTerm?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.replacementOccurrenceId !== null)
  @IsString()
  @IsUUID()
  replacementOccurrenceId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.toOn !== null)
  @IsISO8601({ strict: true })
  toOn?: CalendarDate | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
