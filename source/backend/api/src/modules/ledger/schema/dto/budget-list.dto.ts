import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { BudgetDto } from "#/modules/ledger/schema/dto/budget.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Budget List
 */
export class BudgetListDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => BudgetDto)
  budgets!: BudgetDto[];

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];
}
