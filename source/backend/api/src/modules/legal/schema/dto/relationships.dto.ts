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
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A substantive legal operation or hierarchy link between wordings or instruments. Source derivation is not recorded here. (entity)
 *
 * Invariant "ExactlyOneLevel" has no simple form, so it isn't validated here.
 *
 * Invariant "InstrumentEndsTogether" has no simple form, so it isn't validated here.
 */
export class RelationshipsDto {
  @IsOptional()
  @ValidateIf((object) => object.affectedWordingId !== null)
  @IsString()
  @IsUUID()
  @Satisfies<RelationshipsDto>((object) => object.affectedWordingId !== object.resultingWordingId, {
    message: "Wording Must Not Affect Itself",
  })
  affectedWordingId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.authorityWordingId !== null)
  @IsString()
  @IsUUID()
  authorityWordingId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.citationId !== null)
  @IsString()
  @IsUUID()
  citationId?: Id | null;

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

  @IsOptional()
  @ValidateIf((object) => object.explanation !== null)
  @IsString()
  @MaxLength(4000)
  explanation?: Description | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  kindId!: Id;

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
  @Satisfies<RelationshipsDto>(
    (object) => object.subjectInstrumentId !== object.objectInstrumentId,
    {
      message: "Instruments Must Differ",
    },
  )
  subjectInstrumentId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
