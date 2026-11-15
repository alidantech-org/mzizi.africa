import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";
import { SortDirection } from "#/modules/shared/schema/enum/sort-direction.enum.ts";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";
import type { StatusCode } from "#/modules/shared/schema/type/status-code.type.ts";

/**
 * Base Query
 */
export class BaseQueryDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  limit?: NonNegativeInteger;

  @IsOptional()
  @IsEnum(SortDirection)
  order?: SortDirection;

  @IsOptional()
  @IsInt()
  @Min(0)
  page?: NonNegativeInteger;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  sort?: StatusCode;
}
