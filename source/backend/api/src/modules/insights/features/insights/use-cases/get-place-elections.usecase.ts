import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { PlaceOnlyDto } from "#/modules/insights/schema/dto/place-only.dto";
import type { PlaceElectionsDto } from "#/modules/insights/schema/dto/place-elections.dto";
import { placeElections } from "#/modules/insights/features/insights/reads/elections.ts";

/** Scaffolded by Dryv once; this file belongs to the project. The query lives in `reads/elections.ts`. */
@Injectable()
export class GetPlaceElectionsUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: PlaceOnlyDto): Promise<PlaceElectionsDto> {
    return (await placeElections(this.db, input.featureId)) as unknown as PlaceElectionsDto;
  }
}
