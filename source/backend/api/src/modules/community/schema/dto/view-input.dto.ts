import { IsString, MaxLength, MinLength } from "class-validator";
import type { SubjectCode } from "#/modules/community/schema/type/subject-code.type.ts";
import type { Visitor } from "#/modules/community/schema/type/visitor.type.ts";

/**
 * View Input
 */
export class ViewInputDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  subjectCode!: SubjectCode;

  @IsString()
  @MinLength(1)
  @MaxLength(600)
  visitor!: Visitor;
}
