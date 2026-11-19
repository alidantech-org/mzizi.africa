import { IsString, IsUUID, MaxLength, MinLength, ValidateIf } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";

/**
 * Structure Document Functions Assignments
 */
export class StructureDocumentFunctionsAssignmentsDto {
  @ValidateIf((object) => object.citationId !== null)
  @IsString()
  @IsUUID()
  citationId!: Id | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @ValidateIf((object) => object.institutionId !== null)
  @IsString()
  @IsUUID()
  institutionId!: Id | null;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  share!: Name;

  @ValidateIf((object) => object.startInstitutionId !== null)
  @IsString()
  @IsUUID()
  startInstitutionId!: Id | null;

  @ValidateIf((object) => object.startPositionId !== null)
  @IsString()
  @IsUUID()
  startPositionId!: Id | null;
}
