import type { FrontendMessage } from "#sdk/types/frontend/dto/message.ts";

/** Copy Bundle */
export interface FrontendCopyBundle {
  language: string;
  messages: FrontendMessage[];
}
