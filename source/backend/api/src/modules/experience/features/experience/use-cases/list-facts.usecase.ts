import { Injectable, } from "@nestjs/common";
import { DataSource } from "typeorm";
import { listFacts } from "#/modules/insights/features/insights/reads/facts.ts";
import type { FactListDto } from "#/modules/experience/schema/dto/fact-list.dto";
import type { FactsInputDto } from "#/modules/experience/schema/dto/facts-input.dto";

/**
 * Fun facts for the country and, with a place, for it and the places above it.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class ListFactsUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: FactsInputDto): Promise<FactListDto> {
    return (await listFacts(this.db, input.featureId, input.limit ?? 20)) as unknown as FactListDto;
  }
}
