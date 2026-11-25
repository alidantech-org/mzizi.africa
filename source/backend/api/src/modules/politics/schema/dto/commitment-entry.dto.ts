import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsNumber,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { CommitmentEntryFulfilmentsDto } from "#/modules/politics/schema/dto/commitment-entry-fulfilments.dto.ts";
import { CommitmentKind } from "#/modules/politics/schema/enum/commitment-kind.enum.ts";
import type { Statement } from "#/modules/politics/schema/type/statement.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/**
 * Commitment Entry
 */
export class CommitmentEntryDto {
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
  commitmentId!: Id;

  @ValidateIf((object) => object.dueOn !== null)
  @IsISO8601({ strict: true })
  dueOn!: CalendarDate | null;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CommitmentEntryFulfilmentsDto)
  fulfilments!: CommitmentEntryFulfilmentsDto[];

  @IsEnum(CommitmentKind)
  kind!: CommitmentKind;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  languageCode!: IdentityCode;

  @ValidateIf((object) => object.madeOn !== null)
  @IsISO8601({ strict: true })
  madeOn!: CalendarDate | null;

  @ValidateIf((object) => object.placeId !== null)
  @IsString()
  @IsUUID()
  placeId!: Id | null;

  @ValidateIf((object) => object.quantity !== null)
  @IsNumber({})
  quantity!: Number | null;

  @IsString()
  @MinLength(1)
  @MaxLength(8000)
  statement!: Statement;

  @ValidateIf((object) => object.statusAsOf !== null)
  @IsISO8601({ strict: true })
  statusAsOf!: CalendarDate | null;

  @IsString()
  @IsUUID()
  statusTerm!: Id;

  @ValidateIf((object) => object.topicTerm !== null)
  @IsString()
  @IsUUID()
  topicTerm!: Id | null;
}
