import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { CoverageItemDto } from "#/modules/ledger/schema/dto/coverage-item.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Coverage List
 */
export class CoverageListDto {
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CoverageItemDto)
  items!: CoverageItemDto[];
}
