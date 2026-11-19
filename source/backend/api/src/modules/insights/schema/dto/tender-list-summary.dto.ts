import { Type } from "class-transformer";
import { IsArray, IsNumber, IsDefined, ValidateNested } from "class-validator";
import { TenderListSummaryByStatusDto } from "#/modules/insights/schema/dto/tender-list-summary-by-status.dto.ts";
import { TenderListSummaryTransparencyDto } from "#/modules/insights/schema/dto/tender-list-summary-transparency.dto.ts";
import type { Number } from "#/modules/shared/schema/type/number.type.ts";

/**
 * Tender List Summary
 */
export class TenderListSummaryDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => TenderListSummaryByStatusDto)
  byStatus!: TenderListSummaryByStatusDto[];

  @IsNumber({})
  total!: Number;

  @IsDefined()
  @ValidateNested()
  @Type(() => TenderListSummaryTransparencyDto)
  transparency!: TenderListSummaryTransparencyDto;
}
