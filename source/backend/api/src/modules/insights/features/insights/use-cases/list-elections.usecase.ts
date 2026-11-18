import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { ElectionListDto } from "#/modules/insights/schema/dto/election-list.dto";
import { listElections } from "#/modules/insights/features/insights/reads/elections.ts";

/** Scaffolded by Dryv once; this file belongs to the project. The query lives in `reads/elections.ts`. */
@Injectable()
export class ListElectionsUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(): Promise<ElectionListDto> {
    return (await listElections(this.db)) as unknown as ElectionListDto;
  }
}
