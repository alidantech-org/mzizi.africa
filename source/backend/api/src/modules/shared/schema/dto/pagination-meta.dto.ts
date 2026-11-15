
import {
  IsInt,
  Min,
} from "class-validator";
import type { NonNegativeInteger } from "#/modules/shared/schema/type/non-negative-integer.type.ts";

/**
 * Pagination Meta
 */
export class PaginationMetaDto {

  @IsInt()
  @Min(0)
  limit!: NonNegativeInteger;

  @IsInt()
  @Min(0)
  page!: NonNegativeInteger;

  @IsInt()
  @Min(0)
  total!: NonNegativeInteger;

  @IsInt()
  @Min(0)
  totalPages!: NonNegativeInteger;
}