import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { GovTreeInputDto } from "#/modules/insights/schema/dto/gov-tree-input.dto";
import type { GovernanceTreeDto } from "#/modules/insights/schema/dto/governance-tree.dto";
import { governanceTree } from "#/modules/insights/features/insights/reads/govtree.ts";

/** Scaffolded by Dryv once; this file belongs to the project. The read lives in `reads/`. */
@Injectable()
export class GetGovernanceTreeUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: GovTreeInputDto): Promise<GovernanceTreeDto> {
    return (await governanceTree(this.db, input)) as unknown as GovernanceTreeDto;
  }
}
