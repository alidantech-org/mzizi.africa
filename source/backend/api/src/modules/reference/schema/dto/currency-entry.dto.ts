import { Type } from "class-transformer";
import {
  IsArray,
  IsInt,
  IsString,
  IsUUID,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { CurrencyEntryNamesDto } from "#/modules/reference/schema/dto/currency-entry-names.dto.ts";
import type { CurrencyCode } from "#/modules/reference/schema/type/currency-code.type.ts";
import type { MinorUnits } from "#/modules/reference/schema/type/minor-units.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";

/**
 * Currency Entry
 */
export class CurrencyEntryDto {
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
  currencyId!: Id;

  @ValidateIf((object) => object.isoCode !== null)
  @IsString()
  @Length(3, 3)
  @Matches(new RegExp("^[A-Z]{3}$"))
  isoCode!: CurrencyCode | null;

  @IsInt()
  @Min(0)
  @Max(6)
  minorUnits!: MinorUnits;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CurrencyEntryNamesDto)
  names!: CurrencyEntryNamesDto[];

  @ValidateIf((object) => object.symbol !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  symbol!: NonEmptyString100 | null;
}
