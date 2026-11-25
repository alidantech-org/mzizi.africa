import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { RelationshipEntryDto } from "#/modules/governance/schema/dto/relationship-entry.dto.ts";

/**
 * Relationship Collection
 */
export class RelationshipCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => RelationshipEntryDto)
  relationships!: RelationshipEntryDto[];
}
