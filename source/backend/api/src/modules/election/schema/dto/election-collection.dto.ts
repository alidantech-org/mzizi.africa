import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { ElectionEntryDto } from "#/modules/election/schema/dto/election-entry.dto.ts";

/**
 * Election Collection
 */
export class ElectionCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ElectionEntryDto)
  elections!: ElectionEntryDto[];
}
