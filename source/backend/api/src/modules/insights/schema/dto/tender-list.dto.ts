import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { TenderListSummaryDto } from "#/modules/insights/schema/dto/tender-list-summary.dto.ts";
import { TenderListTendersDto } from "#/modules/insights/schema/dto/tender-list-tenders.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Tender List
 */
export class TenderListDto {
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsDefined()
  @ValidateNested()
  @Type(() => TenderListSummaryDto)
  summary!: TenderListSummaryDto;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => TenderListTendersDto)
  tenders!: TenderListTendersDto[];
}
