import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import { featureIdAt, remembered } from "#/modules/explorer/features/explorer/reads/explorer.ts";
import type { PlaceStatisticsInputDto } from "#/modules/insights/schema/dto/place-statistics-input.dto";
import type { PlaceStatisticsDto } from "#/modules/insights/schema/dto/place-statistics.dto";
import { placeStatistics, type StatisticsScope } from "#/modules/insights/features/insights/reads/statistics.ts";

/**
 * The same statistics as GetPlaceStatistics, for a place named by its readable address. The address is resolved on the server; no identity is sent.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 */
@Injectable()
export class GetPlaceStatisticsAtUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: PlaceStatisticsInputDto): Promise<PlaceStatisticsDto> {
    const featureId = await featureIdAt(this.db, input.countryCode, input.path, input.languageCode);
    // Costly to compose and stable between data loads, so a recent answer is kept briefly.
    const scope = (["headline", "topics", "topic"] as const).find((x) => x === input.scope) as StatisticsScope | undefined;
    const key = `statistics:${featureId}:${scope ?? "all"}:${scope === "topic" ? (input.topic ?? "") : ""}`;
    return (await remembered(key, () => placeStatistics(this.db, featureId, scope, input.topic))) as unknown as PlaceStatisticsDto;
  }
}
