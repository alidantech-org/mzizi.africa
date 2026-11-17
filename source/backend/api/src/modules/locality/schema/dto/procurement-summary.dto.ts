import { Type } from "class-transformer";
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { ProcurementItemDto } from "#/modules/locality/schema/dto/procurement-item.dto.ts";
import type { Amount } from "#/modules/locality/schema/type/amount.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/**
 * Procurement Summary
 */
export class ProcurementSummaryDto {
  @IsInt()
  @Min(0)
  count!: NonNegativeInteger;

  @IsOptional()
  @ValidateIf((object) => object.currency !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  currency?: NonEmptyString100 | null;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ProcurementItemDto)
  recent!: ProcurementItemDto[];

  @IsOptional()
  @ValidateIf((object) => object.totalAmount !== null)
  @IsNumber({})
  @Min(0)
  totalAmount?: Amount | null;
}
