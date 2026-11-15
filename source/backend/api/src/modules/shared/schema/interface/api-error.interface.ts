
import type { Message } from "#/modules/shared/schema/type/message.type.ts";
import type { StatusCode } from "#/modules/shared/schema/type/status-code.type.ts";

/** Api Error */
export interface ApiError {
  code?: StatusCode;
  message: Message;
}