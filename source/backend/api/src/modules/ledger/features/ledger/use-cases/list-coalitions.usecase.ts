import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import type { CoalitionListDto } from "#/modules/ledger/schema/dto/coalition-list.dto";
import { coalitions } from "#/modules/ledger/features/ledger/reads.ts";

/**
 * Coalitions of parties.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class ListCoalitionsUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(): Promise<CoalitionListDto> {
    return (await coalitions(this.db)) as unknown as CoalitionListDto;
  }
}
