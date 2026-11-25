import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { EvidenceEntryDto } from "#/modules/source/schema/dto/evidence-entry.dto.ts";

/**
 * Evidence Collection
 */
export class EvidenceCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => EvidenceEntryDto)
  evidence!: EvidenceEntryDto[];
}
