import { Allow, IsOptional, IsString, ValidateIf } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Project Detail Project
 */
export class ProjectDetailProjectDto {
  @IsString()
  code!: String;

  @IsOptional()
  @ValidateIf((object) => object.completedOn !== null)
  @IsString()
  completedOn?: String | null;

  @IsString()
  description!: String;

  @Allow()
  location!: unknown;

  @IsString()
  name!: String;

  @IsOptional()
  @ValidateIf((object) => object.responsible !== null)
  @IsString()
  responsible?: String | null;

  @IsString()
  startedOn!: String;

  @IsString()
  status!: String;

  @IsString()
  unit!: String;

  @IsString()
  unitId!: String;

  @IsString()
  unitPath!: String;
}
