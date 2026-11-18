import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { PlaceOnlyDto } from "#/modules/insights/schema/dto/place-only.dto";
import type { PlaceCivicDto } from "#/modules/insights/schema/dto/place-civic.dto";
import { placeCivic } from "#/modules/insights/features/insights/reads/civic.ts";

/** Scaffolded by Dryv once; this file belongs to the project. The query lives in `reads/civic.ts`. */
@Injectable()
export class GetPlaceCivicUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: PlaceOnlyDto): Promise<PlaceCivicDto> {
    return (await placeCivic(this.db, input.featureId)) as unknown as PlaceCivicDto;
  }
}
