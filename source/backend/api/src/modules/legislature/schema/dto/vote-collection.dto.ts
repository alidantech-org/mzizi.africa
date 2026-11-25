import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { VoteEntryDto } from "#/modules/legislature/schema/dto/vote-entry.dto.ts";

/**
 * Vote Collection
 */
export class VoteCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => VoteEntryDto)
  votes!: VoteEntryDto[];
}
