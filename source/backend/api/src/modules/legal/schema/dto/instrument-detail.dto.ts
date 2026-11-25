import { Type } from "class-transformer";
import {
  IsArray,
  IsISO8601,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { InstrumentDetailEditionsDto } from "#/modules/legal/schema/dto/instrument-detail-editions.dto.ts";
import { InstrumentDetailNamesDto } from "#/modules/legal/schema/dto/instrument-detail-names.dto.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/**
 * Instrument Detail
 */
export class InstrumentDetailDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => InstrumentDetailEditionsDto)
  editions!: InstrumentDetailEditionsDto[];

  @ValidateIf((object) => object.enactedOn !== null)
  @IsISO8601({ strict: true })
  enactedOn!: CalendarDate | null;

  @IsString()
  @IsUUID()
  instrumentId!: Id;

  @ValidateIf((object) => object.issuerId !== null)
  @IsString()
  @IsUUID()
  issuerId!: Id | null;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => InstrumentDetailNamesDto)
  names!: InstrumentDetailNamesDto[];

  @ValidateIf((object) => object.publishedOn !== null)
  @IsISO8601({ strict: true })
  publishedOn!: CalendarDate | null;

  @ValidateIf((object) => object.statusTerm !== null)
  @IsString()
  @IsUUID()
  statusTerm!: Id | null;
}
