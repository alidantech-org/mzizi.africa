import { Type } from "class-transformer";
import { IsArray, IsDefined, ValidateNested } from "class-validator";
import { AddressMatchDto } from "#/modules/identity/schema/dto/address-match.dto.ts";

/**
 * Address Matches
 */
export class AddressMatchesDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => AddressMatchDto)
  addresses!: AddressMatchDto[];
}
