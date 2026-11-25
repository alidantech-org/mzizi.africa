import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { BudgetEntryDto } from "#/modules/finance/schema/dto/budget-entry.dto.ts";

/**
 * Budget Collection
 */
export class BudgetCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => BudgetEntryDto)
  budgets!: BudgetEntryDto[];
}
