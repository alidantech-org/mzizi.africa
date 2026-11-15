import { Type } from "class-transformer";
import {
  IsDefined,
  ValidateNested,
} from "class-validator";
import { PaginationMetaDto } from "#/modules/shared/dto/pagination-meta.dto.ts";

/**
 * Paginated Response
 */
export class PaginatedResponseDto {

  @IsDefined()
  @ValidateNested()
  @Type(() => PaginationMetaDto)
  meta!: PaginationMetaDto;
}