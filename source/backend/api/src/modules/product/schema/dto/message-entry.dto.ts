import {
  IsEnum,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import { MessageStatus } from "#/modules/product/schema/enum/message-status.enum.ts";
import { TextOrigin } from "#/modules/product/schema/enum/text-origin.enum.ts";
import type { KeyCode } from "#/modules/product/schema/type/key-code.type.ts";
import type { MessageText } from "#/modules/product/schema/type/message-text.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/**
 * Message Entry
 */
export class MessageEntryDto {
  @ValidateIf((object) => object.countryId !== null)
  @IsString()
  @IsUUID()
  countryId!: Id | null;

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @Matches(new RegExp("^[a-z][a-z0-9-]*(\\.[a-z0-9][a-z0-9-]*)+$"))
  key!: KeyCode;

  @IsEnum(TextOrigin)
  origin!: TextOrigin;

  @IsEnum(MessageStatus)
  status!: MessageStatus;

  @IsString()
  @MinLength(1)
  @MaxLength(8000)
  text!: MessageText;
}
