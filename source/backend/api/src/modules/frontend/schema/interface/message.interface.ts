import type { MessageKey } from "#/modules/frontend/schema/type/message-key.type.ts";
import type { MessageText } from "#/modules/frontend/schema/type/message-text.type.ts";

/** Message */
export interface Message {
  key: MessageKey;
  text: MessageText;
}
