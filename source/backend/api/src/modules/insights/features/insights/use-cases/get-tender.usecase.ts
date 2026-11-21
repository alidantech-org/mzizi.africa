import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { CodeInputDto } from "#/modules/insights/schema/dto/code-input.dto";
import type { TenderListDto } from "#/modules/insights/schema/dto/tender-list.dto";
import { listTenders } from "#/modules/insights/features/insights/reads/civic.ts";

/** One tender by its code, in the shape of the tender list. Scaffolded by Dryv once; this file belongs to the project. */
@Injectable()
export class GetTenderUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: CodeInputDto): Promise<TenderListDto> {
    return (await listTenders(this.db, undefined, undefined, 1, input.code)) as unknown as TenderListDto;
  }
}
