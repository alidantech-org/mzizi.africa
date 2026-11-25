import type { LanguageCode } from "#/modules/shared/schema/type/language-code.type.ts";
import type { Message } from "#/modules/frontend/schema/interface/message.interface.ts";

/** Copy Bundle */
export interface CopyBundle {
  language: LanguageCode;
  messages: Message[];
}
