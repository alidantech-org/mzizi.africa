import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { StructureDocumentFunctionsAssignmentsDto } from "#/modules/structure/schema/dto/structure-document-functions-assignments.dto.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";

/**
 * Structure Document Functions
 */
export class StructureDocumentFunctionsDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => StructureDocumentFunctionsAssignmentsDto)
  assignments!: StructureDocumentFunctionsAssignmentsDto[];

  @ValidateIf((object) => object.citationId !== null)
  @IsString()
  @IsUUID()
  citationId!: Id | null;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Matches(
    new RegExp(
      "^[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*(\\.[a-z0-9]+(-[a-z0-9]+)*(~[a-z0-9]+(-[a-z0-9]+)*)*){0,15}$",
    ),
  )
  code!: IdentityCode;

  @IsString()
  @IsUUID()
  id!: Id;

  @ValidateIf((object) => object.parentId !== null)
  @IsString()
  @IsUUID()
  parentId!: Id | null;
}
