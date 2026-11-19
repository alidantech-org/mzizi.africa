import {
  IsBoolean,
  IsInt,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { IdentityCode } from "#/modules/shared/schema/type/identity-code.type.ts";
import type { Name } from "#/modules/shared/schema/type/name.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";

/**
 * Structure Document Institutions Powers
 */
export class StructureDocumentInstitutionsPowersDto {
  @IsBoolean()
  binding!: Flag;

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

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  kind!: Name;

  @ValidateIf((object) => object.procedureId !== null)
  @IsString()
  @IsUUID()
  procedureId!: Id | null;

  @ValidateIf((object) => object.step !== null)
  @IsInt()
  @Min(1)
  step!: PositiveInteger | null;

  @ValidateIf((object) => object.targetInstitutionId !== null)
  @IsString()
  @IsUUID()
  targetInstitutionId!: Id | null;

  @ValidateIf((object) => object.targetPositionId !== null)
  @IsString()
  @IsUUID()
  targetPositionId!: Id | null;
}
