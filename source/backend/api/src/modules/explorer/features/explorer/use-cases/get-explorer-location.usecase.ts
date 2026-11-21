import { DataSource } from "typeorm";
import { location } from "#/modules/explorer/features/explorer/reads/explorer.ts";
import { Injectable } from "@nestjs/common";
import type { LocationInputDto } from "#/modules/explorer/schema/dto/location-input.dto";
import type { LocationDto } from "#/modules/explorer/schema/dto/location.dto";

/**
 * Everything the location UI shows for one place, resolved on the server from the readable address: the place, its chain, every level kind, the places inside the country root, each ancestor and the place, and one page of a search or level list. Clients send slugs, never identities.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Delegates composition to the project-owned typed reader.
 */
@Injectable()
export class GetExplorerLocationUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: LocationInputDto): Promise<LocationDto> {
    return location(this.db, input);
  }
}
