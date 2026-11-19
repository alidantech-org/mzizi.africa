import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { ComparisonADto } from "#/modules/insights/schema/dto/comparison-a.dto.ts";
import { ComparisonBDto } from "#/modules/insights/schema/dto/comparison-b.dto.ts";
import { ComparisonRowsDto } from "#/modules/insights/schema/dto/comparison-rows.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Comparison
 */
export class ComparisonDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => ComparisonADto)
  a!: ComparisonADto;

  @IsDefined()
  @ValidateNested()
  @Type(() => ComparisonBDto)
  b!: ComparisonBDto;

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ComparisonRowsDto)
  rows!: ComparisonRowsDto[];
}
