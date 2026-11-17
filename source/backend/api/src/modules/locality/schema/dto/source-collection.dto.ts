import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { SourceEntryDto } from "#/modules/locality/schema/dto/source-entry.dto.ts";

/**
 * Source Collection
 */
export class SourceCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => SourceEntryDto)
  sources!: SourceEntryDto[];
}
