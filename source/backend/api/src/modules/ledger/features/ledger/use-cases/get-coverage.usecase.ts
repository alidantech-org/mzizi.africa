import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import type { CoverageListDto } from "#/modules/ledger/schema/dto/coverage-list.dto";
import { coverage } from "#/modules/ledger/features/ledger/reads.ts";

/**
 * What the platform expects to be published and what has been checked: the honest map of what is missing.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class GetCoverageUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(): Promise<CoverageListDto> {
    return (await coverage(this.db)) as unknown as CoverageListDto;
  }
}
