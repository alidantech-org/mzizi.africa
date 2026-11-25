import { Type } from "class-transformer";
import {
  IsArray,
  IsInt,
  IsISO8601,
  IsString,
  IsUUID,
  Length,
  Matches,
  MaxLength,
  Min,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { TenderEntryNamesDto } from "#/modules/civic/schema/dto/tender-entry-names.dto.ts";
import type { CurrencyCode } from "#/modules/reference/schema/type/currency-code.type.ts";
import type { AmountMinorUnits } from "#/modules/shared/schema/type/amount-minor-units.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { CalendarDate } from "#/modules/shared/schema/type/calendar-date.type.ts";

/**
 * Tender Entry
 */
export class TenderEntryDto {
  @ValidateIf((object) => object.amount !== null)
  @IsInt()
  @Min(0)
  amount!: AmountMinorUnits | null;

  @IsString()
  @IsUUID()
  buyerId!: Id;

  @IsString()
  @IsUUID()
  categoryTerm!: Id;

  @ValidateIf((object) => object.closesOn !== null)
  @IsISO8601({ strict: true })
  closesOn!: CalendarDate | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @ValidateIf((object) => object.currencyCode !== null)
  @IsString()
  @Length(3, 3)
  @Matches(new RegExp("^[A-Z]{3}$"))
  currencyCode!: CurrencyCode | null;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => TenderEntryNamesDto)
  names!: TenderEntryNamesDto[];

  @IsString()
  @IsUUID()
  procedureTerm!: Id;

  @IsString()
  @IsUUID()
  procurementId!: Id;

  @ValidateIf((object) => object.publishedOn !== null)
  @IsISO8601({ strict: true })
  publishedOn!: CalendarDate | null;

  @IsString()
  @IsUUID()
  statusTerm!: Id;
}
