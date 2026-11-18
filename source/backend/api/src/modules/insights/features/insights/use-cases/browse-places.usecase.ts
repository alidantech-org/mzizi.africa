import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { BrowseInputDto } from "#/modules/insights/schema/dto/browse-input.dto";
import type { PlaceBrowseDto } from "#/modules/insights/schema/dto/place-browse.dto";
import { browsePlaces } from "#/modules/insights/features/insights/reads/browse.ts";

/** Scaffolded by Dryv once; this file belongs to the project. The query lives in `reads/browse.ts`. */
@Injectable()
export class BrowsePlacesUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: BrowseInputDto): Promise<PlaceBrowseDto> {
    return (await browsePlaces(this.db, input.featureId)) as unknown as PlaceBrowseDto;
  }
}
