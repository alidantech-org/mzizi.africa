import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from "class-validator";
import { MessageStatus } from "#/modules/product/schema/enum/message-status.enum.ts";
import { TextOrigin } from "#/modules/product/schema/enum/text-origin.enum.ts";
import type { MessageText } from "#/modules/product/schema/type/message-text.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/schema/type/non-empty-string255.type.ts";
import type { PositiveInteger } from "#/modules/shared/schema/type/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/schema/type/instant.type.ts";

/**
 * The text of one interface key in one language, optionally for one country. (entity)
 */
export class MessagesDto {
  @IsOptional()
  @ValidateIf((object) => object.countryId !== null)
  @IsString()
  @IsUUID()
  countryId?: Id | null;

  @IsISO8601({})
  createdAt!: Instant;

  @IsOptional()
  @ValidateIf((object) => object.deletedAt !== null)
  @IsISO8601({})
  deletedAt?: Instant | null;

  @IsString()
  @IsUUID()
  id!: Id;

  @IsString()
  @IsUUID()
  keyId!: Id;

  @IsString()
  @IsUUID()
  languageId!: Id;

  @IsEnum(TextOrigin)
  origin!: TextOrigin;

  @IsEnum(MessageStatus)
  status!: MessageStatus;

  @IsString()
  @MinLength(1)
  @MaxLength(8000)
  text!: MessageText;

  @IsOptional()
  @ValidateIf((object) => object.translator !== null)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  translator?: NonEmptyString255 | null;

  @IsISO8601({})
  updatedAt!: Instant;

  @IsInt()
  @Min(1)
  version!: PositiveInteger;
}
