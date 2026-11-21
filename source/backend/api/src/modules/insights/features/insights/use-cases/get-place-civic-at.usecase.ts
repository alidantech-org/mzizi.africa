import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import { featureIdAt, remembered } from "#/modules/explorer/features/explorer/reads/explorer.ts";
import type { PlaceAtDto } from "#/modules/insights/schema/dto/place-at.dto";
import type { PlaceCivicDto } from "#/modules/insights/schema/dto/place-civic.dto";
import { placeCivic } from "#/modules/insights/features/insights/reads/civic.ts";

/**
 * The same civic delivery as GetPlaceCivic, for a place named by its readable address. The address is resolved on the server; no identity is sent.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 */
@Injectable()
export class GetPlaceCivicAtUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: PlaceAtDto): Promise<PlaceCivicDto> {
    const featureId = await featureIdAt(this.db, input.countryCode, input.path, input.languageCode);
    // Costly to compose and stable between data loads, so a recent answer is kept briefly.
    return (await remembered(`civic:${featureId}`, () => placeCivic(this.db, featureId))) as unknown as PlaceCivicDto;
  }
}
