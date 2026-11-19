import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDefined, ValidateNested } from "class-validator";
import { LeaderProfileActivityContributionsDto } from "#/modules/insights/schema/dto/leader-profile-activity-contributions.dto.ts";
import { LeaderProfileActivityRecentDto } from "#/modules/insights/schema/dto/leader-profile-activity-recent.dto.ts";
import { LeaderProfileActivitySpeechesDto } from "#/modules/insights/schema/dto/leader-profile-activity-speeches.dto.ts";
import { LeaderProfileActivityVotesDto } from "#/modules/insights/schema/dto/leader-profile-activity-votes.dto.ts";
import type { Flag } from "#/modules/shared/schema/type/flag.type.ts";

/**
 * Leader Profile Activity
 */
export class LeaderProfileActivityDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => LeaderProfileActivityContributionsDto)
  contributions!: LeaderProfileActivityContributionsDto;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => LeaderProfileActivityRecentDto)
  recent!: LeaderProfileActivityRecentDto[];

  @IsBoolean()
  recorded!: Flag;

  @IsArray()
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => LeaderProfileActivitySpeechesDto)
  speeches!: LeaderProfileActivitySpeechesDto[];

  @IsDefined()
  @ValidateNested()
  @Type(() => LeaderProfileActivityVotesDto)
  votes!: LeaderProfileActivityVotesDto;
}
