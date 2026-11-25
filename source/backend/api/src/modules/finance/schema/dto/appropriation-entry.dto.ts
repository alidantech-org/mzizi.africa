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
 * Appropriation Entry
 */
export class AppropriationEntryDto {
  @ValidateIf((object) => object.amount !== null)
  @IsInt()
  @Min(0)
  amount!: AmountMinorUnits | null;

  @IsString()
  @IsUUID()
  appropriationId!: Id;

  @IsString()
  @IsUUID()
  classTerm!: Id;

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

  @ValidateIf((object) => object.featureId !== null)
  @IsString()
  @IsUUID()
  featureId!: Id | null;

  @ValidateIf((object) => object.parentId !== null)
  @IsString()
  @IsUUID()
  parentId!: Id | null;

  @ValidateIf((object) => object.projectId !== null)
  @IsString()
  @IsUUID()
  projectId!: Id | null;

  @ValidateIf((object) => object.recipientId !== null)
  @IsString()
  @IsUUID()
  recipientId!: Id | null;
}
