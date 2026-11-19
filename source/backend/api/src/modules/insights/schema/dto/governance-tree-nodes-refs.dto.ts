import { IsOptional, IsString } from "class-validator";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Governance Tree Nodes Refs
 */
export class GovernanceTreeNodesRefsDto {
  @IsOptional()
  @IsString()
  appointment?: String;

  @IsOptional()
  @IsString()
  basis?: String;

  @IsOptional()
  @IsString()
  code?: String;

  @IsOptional()
  @IsString()
  institution?: String;

  @IsOptional()
  @IsString()
  office?: String;

  @IsString()
  scheme!: String;

  @IsOptional()
  @IsString()
  table?: String;

  @IsOptional()
  @IsString()
  tier?: String;

  @IsOptional()
  @IsString()
  value?: String;
}
