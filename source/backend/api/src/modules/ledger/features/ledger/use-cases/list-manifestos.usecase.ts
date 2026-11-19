import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import type { ManifestoListDto } from "#/modules/ledger/schema/dto/manifesto-list.dto";
import { manifestos } from "#/modules/ledger/features/ledger/reads.ts";

/**
 * Party and candidate manifestos by election.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class ListManifestosUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(): Promise<ManifestoListDto> {
    return (await manifestos(this.db)) as unknown as ManifestoListDto;
  }
}
