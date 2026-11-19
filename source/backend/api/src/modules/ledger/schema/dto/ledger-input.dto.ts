import { IsInt, IsOptional, Max, Min } from "class-validator";
import type { Limit } from "#/modules/ledger/schema/type/limit.type.ts";

/**
 * Ledger Input
 */
export class LedgerInputDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  limit?: Limit;
}
