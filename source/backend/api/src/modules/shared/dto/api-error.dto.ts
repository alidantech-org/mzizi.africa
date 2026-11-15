
import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import type { Message } from "#/modules/shared/type/message.type.ts";
import type { StatusCode } from "#/modules/shared/type/status-code.type.ts";

/**
 * Api Error
 */
export class ApiErrorDto {

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  code?: StatusCode;

  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  message!: Message;
}