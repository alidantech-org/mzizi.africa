import { Type } from "class-transformer";
import {
  Allow,
  IsArray,
  IsInt,
  IsString,
  MaxLength,
  Min,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { SearchHitDto } from "#/modules/insights/schema/dto/search-hit.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/**
 * Search Results
 */
export class SearchResultsDto {
  @Allow()
  counts!: Record<string, unknown>;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => SearchHitDto)
  hits!: SearchHitDto[];

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  query!: NonEmptyString500;

  @IsInt()
  @Min(0)
  total!: NonNegativeInteger;
}
