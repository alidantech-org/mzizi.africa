import { IsEnum, IsString, IsUUID } from "class-validator";
import { SubjectTable } from "#/modules/shared/schema/enum/subject-table.enum.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/**
 * Base for a record about one subject: the subject's fully qualified table and its row id. Contributes no other fields.
 */
export class SubjectReferenceDto {
  @IsString()
  @IsUUID()
  subjectId!: Id;

  @IsEnum(SubjectTable)
  subjectTable!: SubjectTable;
}
