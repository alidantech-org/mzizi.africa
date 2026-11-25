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
import type { Note } from "#/modules/civic/schema/type/note.type.ts";
import type { SignedAmount } from "#/modules/civic/schema/type/signed-amount.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A change to a contract's price, period or scope. (entity)
 */
export class VariationsDto {
  @IsOptional()
  @ValidateIf((object) => object.amountChange !== null)
  @IsInt()
  @Satisfies<VariationsDto>((object) => object.amountChange == null || object.currencyId != null, {
    message: "Variation Amount Has Currency",
  })
  amountChange?: SignedAmount | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @IsString()
  @IsUUID()
  contractId!: Id;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.currencyId !== null)
  @IsString()
  @IsUUID()
  currencyId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @IsOptional()
  @ValidateIf((object) => object.newEndOn !== null)
  @IsISO8601({ strict: true })
  newEndOn?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.note !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  @Satisfies<VariationsDto>((object) => object.note == null || object.noteLanguageId != null, {
    message: "Variation Note Has Language",
  })
  note?: Note | null;

  @IsOptional()
  @ValidateIf((object) => object.noteLanguageId !== null)
  @IsString()
  @IsUUID()
  noteLanguageId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.signedOn !== null)
  @IsISO8601({ strict: true })
  signedOn?: CalendarDate | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
