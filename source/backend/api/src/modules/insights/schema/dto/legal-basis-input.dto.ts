import { IsString, MaxLength, MinLength } from "class-validator";
import type { Code } from "#/modules/insights/schema/type/code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";

/**
 * Legal Basis Input
 */
export class LegalBasisInputDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  subjectCode!: Code;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  subjectTable!: NonEmptyString100;
}
