import { IsInt, IsOptional, IsString, IsUUID } from "class-validator";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/**
 * Child Window
 */
export class ChildWindowDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  hierarchyId?: Id;

  @IsOptional()
  @IsString()
  @IsUUID()
  levelId?: Id;

  @IsOptional()
  @IsInt()
  limit?: Integer;

  @IsOptional()
  @IsInt()
  offset?: Integer;

  @IsString()
  @IsUUID()
  parentId!: Id;
}
