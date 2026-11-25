import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { MessageDto } from "#/modules/frontend/schema/dto/message.dto.ts";
import type { LanguageCode } from "#/modules/shared/schema/type/language-code.type.ts";

/**
 * Copy Bundle
 */
export class CopyBundleDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  language!: LanguageCode;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  messages!: MessageDto[];
}
