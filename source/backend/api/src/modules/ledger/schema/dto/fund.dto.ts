import { IsInt, IsOptional, IsString, IsUUID, Max, Min, ValidateIf } from "class-validator";
import type { Count } from "#/modules/ledger/schema/type/count.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { String } from "#/modules/shared/schema/type/string.type.ts";

/**
 * Fund
 */
export class FundDto {
  @IsString()
  code!: String;

  @IsOptional()
  @ValidateIf((object) => object.featureId !== null)
  @IsString()
  @IsUUID()
  featureId?: Id | null;

  @IsInt()
  @Min(0)
  @Max(100000000)
  flows!: Count;

  @IsString()
  kind!: String;

  @IsOptional()
  @ValidateIf((object) => object.manager !== null)
  @IsString()
  manager?: String | null;

  @IsOptional()
  @ValidateIf((object) => object.path !== null)
  @IsString()
  path?: String | null;

  @IsOptional()
  @ValidateIf((object) => object.place !== null)
  @IsString()
  place?: String | null;

  @IsOptional()
  @ValidateIf((object) => object.source !== null)
  @IsString()
  source?: String | null;
}
