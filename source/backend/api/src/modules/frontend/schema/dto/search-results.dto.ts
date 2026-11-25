import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { SearchHitDto } from "#/modules/frontend/schema/dto/search-hit.dto.ts";
import type { LanguageCode } from "#/modules/shared/schema/type/language-code.type.ts";

/**
 * Search Results
 */
export class SearchResultsDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => SearchHitDto)
  hits!: SearchHitDto[];

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  language!: LanguageCode;
}
