import { IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";
import type { Code } from "#/modules/insights/schema/type/code.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/**
 * Gov Tree Input
 */
export class GovTreeInputDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  featureId?: Id;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  institution?: Code;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  tab?: Code;
}
