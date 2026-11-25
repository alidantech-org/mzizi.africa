import { Type } from "class-transformer";
import {
  IsArray,
  IsInt,
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
import { TenderDetailBidsDto } from "#/modules/civic/schema/dto/tender-detail-bids.dto.ts";
import { TenderDetailNamesDto } from "#/modules/civic/schema/dto/tender-detail-names.dto.ts";
import type { CurrencyCode } from "#/modules/reference/schema/type/currency-code.type.ts";
import type { AmountMinorUnits } from "#/modules/shared/schema/type/amount-minor-units.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/**
 * Tender Detail
 */
export class TenderDetailDto {
  @ValidateIf((object) => object.amount !== null)
  @IsInt()
  @Min(0)
  amount!: AmountMinorUnits | null;

  @ValidateIf((object) => object.bidderCount !== null)
  @IsInt()
  @Min(0)
  bidderCount!: NonNegativeInteger | null;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => TenderDetailBidsDto)
  bids!: TenderDetailBidsDto[];

  @IsString()
  @IsUUID()
  buyerId!: Id;

  @IsString()
  @IsUUID()
  categoryTerm!: Id;

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
  @Type(() => TenderDetailNamesDto)
  names!: TenderDetailNamesDto[];

  @IsString()
  @IsUUID()
  procedureTerm!: Id;

  @IsString()
  @IsUUID()
  procurementId!: Id;

  @ValidateIf((object) => object.projectId !== null)
  @IsString()
  @IsUUID()
  projectId!: Id | null;

  @IsString()
  @IsUUID()
  statusTerm!: Id;
}
