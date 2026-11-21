import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import { featureIdAt, remembered } from "#/modules/explorer/features/explorer/reads/explorer.ts";
import type { PlaceAtDto } from "#/modules/insights/schema/dto/place-at.dto";
import type { PlaceStatisticsDto } from "#/modules/insights/schema/dto/place-statistics.dto";
import { placeStatistics } from "#/modules/insights/features/insights/reads/statistics.ts";

/**
 * The same statistics as GetPlaceStatistics, for a place named by its readable address. The address is resolved on the server; no identity is sent.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 */
@Injectable()
export class GetPlaceStatisticsAtUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: PlaceAtDto): Promise<PlaceStatisticsDto> {
    const featureId = await featureIdAt(this.db, input.countryCode, input.path, input.languageCode);
    // Costly to compose and stable between data loads, so a recent answer is kept briefly.
    return (await remembered(`statistics:${featureId}`, () => placeStatistics(this.db, featureId))) as unknown as PlaceStatisticsDto;
  }
}
