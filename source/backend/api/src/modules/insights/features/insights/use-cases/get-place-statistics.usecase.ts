import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { PlaceOnlyDto } from "#/modules/insights/schema/dto/place-only.dto";
import type { PlaceStatisticsDto } from "#/modules/insights/schema/dto/place-statistics.dto";
import { placeStatistics } from "#/modules/insights/features/insights/reads/statistics.ts";

/** Scaffolded by Dryv once; this file belongs to the project. The query lives in `reads/statistics.ts`. */
@Injectable()
export class GetPlaceStatisticsUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: PlaceOnlyDto): Promise<PlaceStatisticsDto> {
    return (await placeStatistics(this.db, input.featureId)) as unknown as PlaceStatisticsDto;
  }
}
