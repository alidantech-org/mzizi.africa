import type { MessageStatus } from "#/modules/product/schema/enum/message-status.enum.ts";
import type { TextOrigin } from "#/modules/product/schema/enum/text-origin.enum.ts";
import type { KeyCode } from "#/modules/product/schema/type/key-code.type.ts";
import type { MessageText } from "#/modules/product/schema/type/message-text.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";

/** Message Entry */
export interface MessageEntry {
  countryId: Id | null;
  key: KeyCode;
  origin: TextOrigin;
  status: MessageStatus;
  text: MessageText;
}
