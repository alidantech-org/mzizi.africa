import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import { featureIdAt } from "#/modules/explorer/features/explorer/reads/explorer.ts";
import type { ElectionAtInputDto } from "#/modules/insights/schema/dto/election-at-input.dto";
import type { ElectionDetailDto } from "#/modules/insights/schema/dto/election-detail.dto";
import { electionDetail } from "#/modules/insights/features/insights/reads/elections.ts";

/** One election with results under a place named by its readable address. Scaffolded by Dryv once; this file belongs to the project. */
@Injectable()
export class GetElectionAtUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: ElectionAtInputDto): Promise<ElectionDetailDto> {
    const parent = input.path ? await featureIdAt(this.db, input.countryCode, input.path, input.languageCode) : undefined;
    return (await electionDetail(this.db, input.electionId, parent, input.contestKind)) as unknown as ElectionDetailDto;
  }
}
