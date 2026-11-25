import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { MessageEntryDto } from "#/modules/product/schema/dto/message-entry.dto.ts";

/**
 * Message Collection
 */
export class MessageCollectionDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => MessageEntryDto)
  messages!: MessageEntryDto[];
}
