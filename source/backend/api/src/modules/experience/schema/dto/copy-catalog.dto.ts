import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { CopyEntryDto } from "#/modules/experience/schema/dto/copy-entry.dto.ts";
import type { Language } from "#/modules/experience/schema/type/language.type.ts";

/**
 * Copy Catalog
 */
export class CopyCatalogDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CopyEntryDto)
  entries!: CopyEntryDto[];

  @IsString()
  @MinLength(2)
  @MaxLength(35)
  languageCode!: Language;
}
