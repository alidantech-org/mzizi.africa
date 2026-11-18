import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { TreeInputDto } from "#/modules/insights/schema/dto/tree-input.dto";
import type { LeaderTreeDto } from "#/modules/insights/schema/dto/leader-tree.dto";
import { leaderTree } from "#/modules/insights/features/insights/reads/tree.ts";

/** Scaffolded by Dryv once; this file belongs to the project. The query lives in `reads/tree.ts`. */
@Injectable()
export class GetLeaderTreeUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: TreeInputDto): Promise<LeaderTreeDto> {
    return (await leaderTree(this.db, input.featureId)) as unknown as LeaderTreeDto;
  }
}
