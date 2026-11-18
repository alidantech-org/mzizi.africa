import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { CodeInputDto } from "#/modules/insights/schema/dto/code-input.dto";
import type { PartyDetailDto } from "#/modules/insights/schema/dto/party-detail.dto";
import { partyDetail } from "#/modules/insights/features/insights/reads/elections.ts";

/** Scaffolded by Dryv once; this file belongs to the project. The query lives in `reads/elections.ts`. */
@Injectable()
export class GetPartyUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: CodeInputDto): Promise<PartyDetailDto> {
    return (await partyDetail(this.db, input.code)) as unknown as PartyDetailDto;
  }
}
