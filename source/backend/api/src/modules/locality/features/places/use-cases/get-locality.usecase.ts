import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { LocalityProfileDto } from "#/modules/locality/schema/dto/locality-profile.dto";
import type { PlaceInputDto } from "#/modules/locality/schema/dto/place-input.dto";
import { buildProfile } from "#/modules/locality/features/places/reads/profile.ts";

/**
 * The same place document for a known feature, for visitors who pick a place by name instead of position.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 */
@Injectable()
export class GetLocalityUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: PlaceInputDto): Promise<LocalityProfileDto> {
    const profile = await buildProfile(this.db, input.featureId, input.languageCode, input.onDate);
    if (profile === null) throw new NotFoundException("This place is not known.");
    return profile;
  }
}
