import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { LocalityProfileDto } from "#/modules/locality/schema/dto/locality-profile.dto";
import type { PositionInputDto } from "#/modules/locality/schema/dto/position-input.dto";
import { buildProfile } from "#/modules/locality/features/places/reads/profile.ts";
import { featureAt } from "#/modules/locality/features/places/reads/places.ts";

/**
 * Who and what serves the place at a position: the containing units, the office holders scoped to them, procurement there, media and the evidence for each claim, in the requested language.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 */
@Injectable()
export class ResolveLocalityUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: PositionInputDto): Promise<LocalityProfileDto> {
    const featureId = await featureAt(this.db, input.latitude, input.longitude);
    if (featureId === null) throw new NotFoundException("No place is recorded at this position.");
    return (await buildProfile(this.db, featureId, input.languageCode, input.onDate))!;
  }
}
