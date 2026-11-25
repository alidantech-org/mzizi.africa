import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import type { AddressSegment } from "#/modules/identity/schema/type/address-segment.type.ts";
import type { Id } from "#/modules/shared/schema/type/id.type.ts";
import type { Integer } from "#/modules/shared/schema/type/integer.type.ts";

/**
 * Address Key
 */
export class AddressKeyDto {
  @IsOptional()
  @IsString()
  @IsUUID()
  countryId?: Id;

  @IsOptional()
  @IsInt()
  limit?: Integer;

  @IsOptional()
  @IsInt()
  offset?: Integer;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @Matches(new RegExp("^[a-z0-9]+(-[a-z0-9]+)*$"))
  segment!: AddressSegment;
}
