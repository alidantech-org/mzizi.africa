import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import { CommitmentKind } from "#/modules/politics/schema/enum/commitment-kind.enum.ts";
import type { Statement } from "#/modules/politics/schema/type/statement.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Year } from "#/modules/shared/schema/type/year.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A promise someone with public power made, in their original words, with its status. (entity)
 */
export class CommitmentsDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

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

  @IsOptional()
  @ValidateIf((object) => object.dueOn !== null)
  @IsISO8601({ strict: true })
  dueOn?: CalendarDate | null;

  @IsOptional()
  @ValidateIf((object) => object.fromYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  fromYear?: Year | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsEnum(CommitmentKind)
  kind!: CommitmentKind;

  @IsString()
  @IsUUID()
  languageId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.madeOn !== null)
  @IsISO8601({ strict: true })
  madeOn?: CalendarDate | null;

  @IsString()
  @IsUUID()
  makerId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.manifestoId !== null)
  @IsString()
  @IsUUID()
  manifestoId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.occurrenceId !== null)
  @IsString()
  @IsUUID()
  occurrenceId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.officeId !== null)
  @IsString()
  @IsUUID()
  officeId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.placeId !== null)
  @IsString()
  @IsUUID()
  placeId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.quantity !== null)
  @IsNumber({})
  @Satisfies<CommitmentsDto>((object) => object.quantity == null || object.unitId != null, {
    message: "Quantity Has Unit",
  })
  quantity?: Number | null;

  @IsOptional()
  @ValidateIf((object) => object.speechId !== null)
  @IsString()
  @IsUUID()
  @Satisfies<CommitmentsDto>((object) => object.speechId == null || object.countryId != null, {
    message: "Speech Commitment Has Country",
  })
  speechId?: Id | null;

  @IsString()
  @MinLength(1)
  @MaxLength(8000)
  statement!: Statement;

  @IsOptional()
  @ValidateIf((object) => object.statusAsOf !== null)
  @IsISO8601({ strict: true })
  statusAsOf?: CalendarDate | null;

  @IsString()
  @IsUUID()
  statusTerm!: Id;

  @IsOptional()
  @ValidateIf((object) => object.toYear !== null)
  @IsInt()
  @Min(-10000)
  @Max(3000)
  toYear?: Year | null;

  @IsOptional()
  @ValidateIf((object) => object.topicTerm !== null)
  @IsString()
  @IsUUID()
  topicTerm?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.unitId !== null)
  @IsString()
  @IsUUID()
  unitId?: Id | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
