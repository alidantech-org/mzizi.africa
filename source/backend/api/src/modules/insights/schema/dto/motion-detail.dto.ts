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
 * Motion Detail
 */
export class MotionDetailDto {
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsOptional()
  @ValidateIf((object) => object.legal !== null)
  @Allow()
  legal?: Record<string, unknown> | null;

  @IsArray()
  @Allow()
  members!: Record<string, unknown>[];

  @Allow()
  motion!: Record<string, unknown>;

  @IsArray()
  @Allow()
  parties!: Record<string, unknown>[];

  @Allow()
  tally!: Record<string, unknown>;
}
