
import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";
import type { Id } from "#/modules/shared/id.type.ts";
import type { Integer } from "#/modules/shared/integer.type.ts";

/**
 * Member Window
 */
export class MemberWindowDto {

  @IsOptional()
  @IsInt()
  limit?: Integer;

  @IsOptional()
  @IsInt()
  offset?: Integer;

  @IsString()
  @IsUUID()
  schemeId!: Id;
}