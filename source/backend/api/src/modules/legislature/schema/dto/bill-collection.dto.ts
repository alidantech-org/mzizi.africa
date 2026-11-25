import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { BillEntryDto } from "#/modules/legislature/schema/dto/bill-entry.dto.ts";

/**
 * Bill Collection
 */
export class BillCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => BillEntryDto)
  bills!: BillEntryDto[];
}
