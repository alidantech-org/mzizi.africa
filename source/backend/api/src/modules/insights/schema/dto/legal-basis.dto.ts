import { Allow, IsArray, IsString, MaxLength, MinLength } from "class-validator";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Legal Basis
 */
export class LegalBasisDto {
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsArray()
  @Allow()
  items!: Record<string, unknown>[];

  @Allow()
  subject!: Record<string, unknown>;
}
