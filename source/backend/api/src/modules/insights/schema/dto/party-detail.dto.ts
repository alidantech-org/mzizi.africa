import { Type } from "class-transformer";
import {
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { PartyDetailFundingDto } from "#/modules/insights/schema/dto/party-detail-funding.dto.ts";
import { PartyDetailMembersDto } from "#/modules/insights/schema/dto/party-detail-members.dto.ts";
import { PartyDetailPartyDto } from "#/modules/insights/schema/dto/party-detail-party.dto.ts";
import { PartyDetailResultsDto } from "#/modules/insights/schema/dto/party-detail-results.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Party Detail
 */
export class PartyDetailDto {
  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PartyDetailFundingDto)
  funding!: PartyDetailFundingDto[];

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PartyDetailMembersDto)
  members!: PartyDetailMembersDto[];

  @IsDefined()
  @ValidateNested()
  @Type(() => PartyDetailPartyDto)
  party!: PartyDetailPartyDto;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => PartyDetailResultsDto)
  results!: PartyDetailResultsDto[];
}
