import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import type { Limit } from "#/modules/insights/schema/type/limit.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/schema/type/non-empty-string100.type.ts";

/**
 * Tender Input
 */
export class TenderInputDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  featureId?: Id;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  limit?: Limit;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  status?: NonEmptyString100;
}
