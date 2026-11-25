import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { UseEntryDto } from "#/modules/media/schema/dto/use-entry.dto.ts";

/**
 * Use Collection
 */
export class UseCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => UseEntryDto)
  uses!: UseEntryDto[];
}
