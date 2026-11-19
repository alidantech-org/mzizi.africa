import { IsString, IsUUID, Matches, MaxLength, MinLength, ValidateIf } from "class-validator";
import type { Description } from "#/modules/shared/schema/type/description.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";

/**
 * Structure Document Procedures
 */
export class StructureDocumentProceduresDto {
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
  @MaxLength(4000)
  description!: Description;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  kind!: Name;
}
