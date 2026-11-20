import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { CopyEntryDto } from "#/modules/explorer/schema/dto/copy-entry.dto.ts";
import type { CopyHash } from "#/modules/explorer/schema/type/copy-hash.type.ts";
import type { LanguageCode } from "#/modules/explorer/schema/type/language-code.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";

/**
 * Copy Bundle
 */
export class CopyBundleDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CopyEntryDto)
  entries!: CopyEntryDto[];

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  hash!: CopyHash;

  @IsString()
  @MinLength(2)
  @MaxLength(35)
  language!: LanguageCode;

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(255, { each: true })
  missing!: NonEmptyString255[];
}
