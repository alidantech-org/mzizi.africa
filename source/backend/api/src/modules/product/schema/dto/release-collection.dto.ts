import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { ReleaseEntryDto } from "#/modules/product/schema/dto/release-entry.dto.ts";

/**
 * Release Collection
 */
export class ReleaseCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ReleaseEntryDto)
  releases!: ReleaseEntryDto[];
}
