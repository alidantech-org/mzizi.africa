import {
  Allow,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Content Page
 */
export class ContentPageDto {
  @IsOptional()
  @ValidateIf((object) => object.content !== null)
  @Allow()
  content?: Record<string, unknown> | null;

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsArray()
  @Allow()
  related!: Record<string, unknown>[];
}
