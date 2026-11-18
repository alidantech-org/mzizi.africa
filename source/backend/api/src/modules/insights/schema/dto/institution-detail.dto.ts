import { Allow, IsArray, IsString, MaxLength, MinLength } from "class-validator";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Institution Detail
 */
export class InstitutionDetailDto {
  @IsArray()
  @Allow()
  children!: Record<string, unknown>[];

  @IsArray()
  @Allow()
  content!: Record<string, unknown>[];

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @Allow()
  institution!: Record<string, unknown>;

  @IsArray()
  @Allow()
  leaders!: Record<string, unknown>[];

  @IsArray()
  @Allow()
  legalBasis!: Record<string, unknown>[];

  @IsArray()
  @Allow()
  metrics!: Record<string, unknown>[];

  @IsArray()
  @Allow()
  parents!: Record<string, unknown>[];
}
