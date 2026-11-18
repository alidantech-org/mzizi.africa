import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { NearbyInputDto } from "#/modules/insights/schema/dto/nearby-input.dto";
import type { NearbyProjectsDto } from "#/modules/insights/schema/dto/nearby-projects.dto";
import { nearbyProjects } from "#/modules/insights/features/insights/reads/nearby.ts";

/** Scaffolded by Dryv once; this file belongs to the project. The query lives in `reads/nearby.ts`. */
@Injectable()
export class GetNearbyProjectsUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: NearbyInputDto): Promise<NearbyProjectsDto> {
    return (await nearbyProjects(this.db, input.latitude, input.longitude, input.radiusKm)) as unknown as NearbyProjectsDto;
  }
}
