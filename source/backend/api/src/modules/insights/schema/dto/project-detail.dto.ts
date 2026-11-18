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
 * Project Detail
 */
export class ProjectDetailDto {
  @IsArray()
  @Allow()
  evidence!: Record<string, unknown>[];

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsArray()
  @Allow()
  media!: Record<string, unknown>[];

  @IsArray()
  @Allow()
  money!: Record<string, unknown>[];

  @IsOptional()
  @ValidateIf((object) => object.procurement !== null)
  @Allow()
  procurement?: Record<string, unknown> | null;

  @Allow()
  project!: Record<string, unknown>;
}
