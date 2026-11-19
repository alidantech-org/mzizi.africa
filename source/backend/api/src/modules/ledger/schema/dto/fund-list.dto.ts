import { Type } from "class-transformer";
import {
  IsArray,
  IsInt,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { FundDto } from "#/modules/ledger/schema/dto/fund.dto.ts";
import type { Count } from "#/modules/ledger/schema/type/count.type.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Fund List
 */
export class FundListDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => FundDto)
  funds!: FundDto[];

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsInt()
  @Min(0)
  @Max(100000000)
  total!: Count;
}
