import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { TenderInputDto } from "#/modules/insights/schema/dto/tender-input.dto";
import type { TenderListDto } from "#/modules/insights/schema/dto/tender-list.dto";
import { listTenders } from "#/modules/insights/features/insights/reads/civic.ts";

/** Scaffolded by Dryv once; this file belongs to the project. The query lives in `reads/civic.ts`. */
@Injectable()
export class ListTendersUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: TenderInputDto): Promise<TenderListDto> {
    return (await listTenders(this.db, input.status, input.featureId, input.limit ?? 100)) as unknown as TenderListDto;
  }
}
