
import type { Message } from "#/modules/shared/type/message.type.ts";
import type { StatusCode } from "#/modules/shared/type/status-code.type.ts";

/** Api Error */
export interface ApiError {
  code?: StatusCode;
  message: Message;
}