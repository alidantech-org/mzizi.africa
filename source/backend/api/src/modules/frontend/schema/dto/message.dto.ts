import { IsString, MaxLength, MinLength } from "class-validator";
import type { MessageKey } from "#/modules/frontend/schema/type/message-key.type.ts";
import type { MessageText } from "#/modules/frontend/schema/type/message-text.type.ts";

/**
 * Message
 */
export class MessageDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  key!: MessageKey;

  @IsString()
  @MinLength(1)
  @MaxLength(8000)
  text!: MessageText;
}
