import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { CommitmentEntryDto } from "#/modules/politics/schema/dto/commitment-entry.dto.ts";

/**
 * Commitment Collection
 */
export class CommitmentCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => CommitmentEntryDto)
  commitments!: CommitmentEntryDto[];
}
