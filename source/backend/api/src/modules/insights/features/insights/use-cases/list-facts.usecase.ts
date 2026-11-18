import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { FactsInputDto } from "#/modules/insights/schema/dto/facts-input.dto";
import type { FactListDto } from "#/modules/insights/schema/dto/fact-list.dto";
import { listFacts } from "#/modules/insights/features/insights/reads/facts.ts";

/** Scaffolded by Dryv once; this file belongs to the project. The query lives in `reads/facts.ts`. */
@Injectable()
export class ListFactsUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: FactsInputDto): Promise<FactListDto> {
    return (await listFacts(this.db, input.featureId, input.limit ?? 30)) as unknown as FactListDto;
  }
}
