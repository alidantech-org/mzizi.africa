import {
  IsEnum,
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
import { TextOrigin } from "#/modules/legislature/schema/enum/text-origin.enum.ts";
import { TextStatus } from "#/modules/legislature/schema/enum/text-status.enum.ts";
import type { Summary } from "#/modules/legislature/schema/type/summary.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A title or summary of a bill, motion, speech or agenda item in one language. (entity)
 *
 * Invariant "SummaryHasOneSubject" has no simple form, so it isn't validated here.
 */
export class SummariesDto {
  @IsOptional()
  @ValidateIf((object) => object.agendaId !== null)
  @IsString()
  @IsUUID()
  agendaId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.billId !== null)
  @IsString()
  @IsUUID()
  billId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.countryId !== null)
  @IsString()
  @IsUUID()
  countryId?: Id | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  languageId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.motionId !== null)
  @IsString()
  @IsUUID()
  motionId?: Id | null;

  @IsEnum(TextOrigin)
  origin!: TextOrigin;

  @IsOptional()
  @ValidateIf((object) => object.speechId !== null)
  @IsString()
  @IsUUID()
  @Satisfies<SummariesDto>((object) => object.speechId == null || object.countryId != null, {
    message: "Speech Summary Has Country",
  })
  speechId?: Id | null;

  @IsEnum(TextStatus)
  status!: TextStatus;

  @IsString()
  @MinLength(1)
  @MaxLength(8000)
  text!: Summary;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
