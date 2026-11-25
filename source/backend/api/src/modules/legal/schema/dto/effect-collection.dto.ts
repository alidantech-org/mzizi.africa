import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { EffectEntryDto } from "#/modules/legal/schema/dto/effect-entry.dto.ts";

/**
 * Effect Collection
 */
export class EffectCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => EffectEntryDto)
  effects!: EffectEntryDto[];
}
