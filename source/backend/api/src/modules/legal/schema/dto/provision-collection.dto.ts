import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { ProvisionEntryDto } from "#/modules/legal/schema/dto/provision-entry.dto.ts";

/**
 * Provision Collection
 */
export class ProvisionCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ProvisionEntryDto)
  provisions!: ProvisionEntryDto[];
}
