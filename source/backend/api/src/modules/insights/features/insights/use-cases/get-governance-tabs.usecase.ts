import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { GovernanceTabsDto } from "#/modules/insights/schema/dto/governance-tabs.dto";
import { governanceTabs } from "#/modules/insights/features/insights/reads/govtree.ts";

/** Scaffolded by Dryv once; this file belongs to the project. The read lives in `reads/`. */
@Injectable()
export class GetGovernanceTabsUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(): Promise<GovernanceTabsDto> {
    return (await governanceTabs(this.db)) as unknown as GovernanceTabsDto;
  }
}
