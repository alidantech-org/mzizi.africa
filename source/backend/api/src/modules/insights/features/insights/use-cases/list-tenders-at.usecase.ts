import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import { featureIdAt } from "#/modules/explorer/features/explorer/reads/explorer.ts";
import type { TenderListDto } from "#/modules/insights/schema/dto/tender-list.dto";
import type { TendersAtInputDto } from "#/modules/insights/schema/dto/tenders-at-input.dto";
import { listTenders } from "#/modules/insights/features/insights/reads/civic.ts";

/** Tenders for a place (and the places inside it), or for the whole country. Scaffolded by Dryv once; this file belongs to the project. */
@Injectable()
export class ListTendersAtUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: TendersAtInputDto): Promise<TenderListDto> {
    const featureId = input.path ? await featureIdAt(this.db, input.countryCode, input.path, input.languageCode) : undefined;
    return (await listTenders(this.db, input.status, featureId, input.limit ?? 100)) as unknown as TenderListDto;
  }
}
