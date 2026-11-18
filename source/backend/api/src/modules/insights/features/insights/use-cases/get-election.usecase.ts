import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { ElectionInputDto } from "#/modules/insights/schema/dto/election-input.dto";
import type { ElectionDetailDto } from "#/modules/insights/schema/dto/election-detail.dto";
import { electionDetail } from "#/modules/insights/features/insights/reads/elections.ts";

/** Scaffolded by Dryv once; this file belongs to the project. The query lives in `reads/elections.ts`. */
@Injectable()
export class GetElectionUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: ElectionInputDto): Promise<ElectionDetailDto> {
    return (await electionDetail(this.db, input.electionId, input.parentFeatureId, input.contestKind)) as unknown as ElectionDetailDto;
  }
}
