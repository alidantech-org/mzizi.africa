
import type { Message } from "#/modules/shared/message.type.ts";
import type { StatusCode } from "#/modules/shared/status-code.type.ts";

/** Api Error */
export interface ApiError {
  code?: StatusCode;
  message: Message;
}