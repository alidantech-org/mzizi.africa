import { Type } from "class-transformer";
import {
  Allow,
  IsArray,
  IsString,
  MaxLength,
  MinLength,
  IsDefined,
  ValidateNested,
} from "class-validator";
import { LeaderProfileActivityDto } from "#/modules/insights/schema/dto/leader-profile-activity.dto.ts";
import { LeaderProfileContactsDto } from "#/modules/insights/schema/dto/leader-profile-contacts.dto.ts";
import { LeaderProfileElectionDto } from "#/modules/insights/schema/dto/leader-profile-election.dto.ts";
import { LeaderProfileEvidenceDto } from "#/modules/insights/schema/dto/leader-profile-evidence.dto.ts";
import { LeaderProfileLeaderDto } from "#/modules/insights/schema/dto/leader-profile-leader.dto.ts";
import { LeaderProfileMediaDto } from "#/modules/insights/schema/dto/leader-profile-media.dto.ts";
import { LeaderProfileOfficesDto } from "#/modules/insights/schema/dto/leader-profile-offices.dto.ts";
import type { NonEmptyString500 } from "#/modules/shared/schema/type/non-empty-string500.type.ts";

/**
 * Leader Profile
 */
export class LeaderProfileDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => LeaderProfileActivityDto)
  activity!: LeaderProfileActivityDto;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => LeaderProfileContactsDto)
  contacts!: LeaderProfileContactsDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => LeaderProfileElectionDto)
  election!: LeaderProfileElectionDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => LeaderProfileEvidenceDto)
  evidence!: LeaderProfileEvidenceDto[];

  @Allow()
  fund!: unknown;

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(500, { each: true })
  gaps!: NonEmptyString500[];

  @IsDefined()
  @ValidateNested()
  @Type(() => LeaderProfileLeaderDto)
  leader!: LeaderProfileLeaderDto;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => LeaderProfileMediaDto)
  media!: LeaderProfileMediaDto[];

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => LeaderProfileOfficesDto)
  offices!: LeaderProfileOfficesDto[];
}
