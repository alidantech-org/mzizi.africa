import { IsInt, IsOptional, IsString, Max, Min, ValidateIf } from "class-validator";
import type { Count } from "#/modules/ledger/schema/type/count.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Budget
 */
export class BudgetDto {
  @IsString()
  code!: String;

  @IsOptional()
  @ValidateIf((object) => object.entity !== null)
  @IsString()
  entity?: String | null;

  @IsOptional()
  @ValidateIf((object) => object.fiscalFrom !== null)
  @IsString()
  fiscalFrom?: String | null;

  @IsOptional()
  @ValidateIf((object) => object.fiscalTo !== null)
  @IsString()
  fiscalTo?: String | null;

  @IsString()
  kind!: String;

  @IsOptional()
  @ValidateIf((object) => object.latestReleasedOn !== null)
  @IsString()
  latestReleasedOn?: String | null;

  @IsInt()
  @Min(0)
  @Max(100000000)
  revisions!: Count;
}
