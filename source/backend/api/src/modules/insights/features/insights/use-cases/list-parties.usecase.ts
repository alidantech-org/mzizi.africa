import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { PartyListDto } from "#/modules/insights/schema/dto/party-list.dto";
import { listParties } from "#/modules/insights/features/insights/reads/elections.ts";

/** Scaffolded by Dryv once; this file belongs to the project. The query lives in `reads/elections.ts`. */
@Injectable()
export class ListPartiesUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(): Promise<PartyListDto> {
    return (await listParties(this.db)) as unknown as PartyListDto;
  }
}
