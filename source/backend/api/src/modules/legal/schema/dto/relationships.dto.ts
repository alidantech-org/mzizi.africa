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

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import type { Note } from "#/modules/legal/schema/type/note.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * An amendment, repeal or replacement between instruments or wordings. (entity)
 */
export class RelationshipsDto {
  @IsOptional()
  @ValidateIf((object) => object.affectedWordingId !== null)
  @IsString()
  @IsUUID()
  affectedWordingId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.authorityWordingId !== null)
  @IsString()
  @IsUUID()
  authorityWordingId?: Id | null;

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

  @IsOptional()
  @ValidateIf((object) => object.effectiveOn !== null)
  @IsISO8601({ strict: true })
  effectiveOn?: CalendarDate | null;

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
  @Satisfies<RelationshipsDto>((object) => object.note == null || object.noteLanguageId != null, {
    message: "Relationship Note Has Language",
  })
  note?: Note | null;

  @IsOptional()
  @ValidateIf((object) => object.noteLanguageId !== null)
  @IsString()
  @IsUUID()
  noteLanguageId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.objectInstrumentId !== null)
  @IsString()
  @IsUUID()
  objectInstrumentId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.resultingWordingId !== null)
  @IsString()
  @IsUUID()
  resultingWordingId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.subjectInstrumentId !== null)
  @IsString()
  @IsUUID()
  subjectInstrumentId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
