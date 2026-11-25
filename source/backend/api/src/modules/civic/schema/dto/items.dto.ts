import {
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
} from "class-validator";

import { Satisfies } from "#/modules/common/schema/dto/validators/satisfies.ts";
import type { AmountMinorUnits } from "#/modules/shared/schema/type/amount-minor-units.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * A line item of a contract or bid. (entity)
 *
 * Invariant "ItemHasOneOwner" has no simple form, so it isn't validated here.
 */
export class ItemsDto {
  @IsOptional()
  @ValidateIf((object) => object.bidId !== null)
  @IsString()
  @IsUUID()
  bidId?: Id | null;

  @IsOptional()
  @ValidateIf((object) => object.contractId !== null)
  @IsString()
  @IsUUID()
  contractId?: Id | null;

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
  goodId!: Id;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsNumber({})
  quantity!: Number;

  @IsString()
  @IsUUID()
  unitId!: Id;

  @IsOptional()
  @ValidateIf((object) => object.unitPrice !== null)
  @IsInt()
  @Min(0)
  @Satisfies<ItemsDto>((object) => object.unitPrice == null || object.currencyId != null, {
    message: "Item Price Has Currency",
  })
  unitPrice?: AmountMinorUnits | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
