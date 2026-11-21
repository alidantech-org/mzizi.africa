import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { AddressPlaceDto } from "#/modules/explorer/schema/dto/address-place.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Addresses
 */
export class AddressesDto {
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => AddressPlaceDto)
  places!: AddressPlaceDto[];
}
