import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { IdInputDto } from "#/modules/insights/schema/dto/id-input.dto";
import type { LeaderProfileDto } from "#/modules/insights/schema/dto/leader-profile.dto";
import { leaderProfile } from "#/modules/insights/features/insights/reads/leader.ts";

/** Scaffolded by Dryv once; this file belongs to the project. The query lives in `reads/leader.ts`. */
@Injectable()
export class GetLeaderProfileUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: IdInputDto): Promise<LeaderProfileDto> {
    return (await leaderProfile(this.db, input.id)) as unknown as LeaderProfileDto;
  }
}
