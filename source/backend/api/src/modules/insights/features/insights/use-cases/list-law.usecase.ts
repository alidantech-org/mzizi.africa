import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { LawInputDto } from "#/modules/insights/schema/dto/law-input.dto";
import type { LawListDto } from "#/modules/insights/schema/dto/law-list.dto";
import { listLaw } from "#/modules/insights/features/insights/reads/law.ts";

/** Legal instruments held, highest authority first. Scaffolded by Dryv once; the query lives in `reads/law.ts`. */
@Injectable()
export class ListLawUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: LawInputDto): Promise<LawListDto> {
    return (await listLaw(this.db, input.kindCode)) as unknown as LawListDto;
  }
}
