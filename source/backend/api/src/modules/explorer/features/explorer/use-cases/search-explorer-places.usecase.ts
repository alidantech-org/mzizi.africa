import { DataSource } from "typeorm";
import { search } from "#/modules/explorer/features/explorer/reads/explorer.ts";
import { Injectable } from "@nestjs/common";
import type { PlacesDto } from "#/modules/explorer/schema/dto/places.dto";
import type { SearchInputDto } from "#/modules/explorer/schema/dto/search-input.dto";

/**
 * Country-scoped registered places with stable pagination and canonical destinations.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Delegates composition to the project-owned typed reader.
 */
@Injectable()
export class SearchExplorerPlacesUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: SearchInputDto): Promise<PlacesDto> {
    return search(this.db, input);
  }
}
