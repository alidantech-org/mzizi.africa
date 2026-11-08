
import type { Message } from "#/types/shared/message.type.ts";
import type { StatusCode } from "#/types/shared/status-code.type.ts";

/** Api Error */
export interface ApiError {
  code?: StatusCode;
  message: Message;
}