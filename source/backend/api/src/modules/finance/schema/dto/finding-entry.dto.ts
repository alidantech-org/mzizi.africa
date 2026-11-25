import {
  IsInt,
  IsString,
  IsUUID,
  Length,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import type { CurrencyCode } from "#/modules/reference/schema/type/currency-code.type.ts";
import type { AmountMinorUnits } from "#/modules/shared/schema/type/amount-minor-units.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/**
 * Finding Entry
 */
export class FindingEntryDto {
  @ValidateIf((object) => object.amount !== null)
  @IsInt()
  @Min(0)
  amount!: AmountMinorUnits | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @ValidateIf((object) => object.contractId !== null)
  @IsString()
  @IsUUID()
  contractId!: Id | null;

  @ValidateIf((object) => object.currencyCode !== null)
  @IsString()
  @Length(3, 3)
  @Matches(new RegExp("^[A-Z]{3}$"))
  currencyCode!: CurrencyCode | null;

  @IsString()
  @IsUUID()
  findingId!: Id;

  @IsString()
  @IsUUID()
  kindTerm!: Id;

  @IsString()
  @IsUUID()
  periodId!: Id;

  @ValidateIf((object) => object.projectId !== null)
  @IsString()
  @IsUUID()
  projectId!: Id | null;

  @IsString()
  @IsUUID()
  statusTerm!: Id;
}
