import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { SourceCollectionDto } from "#/modules/locality/schema/dto/source-collection.dto";
import type { SourceSearchInputDto } from "#/modules/locality/schema/dto/source-search-input.dto";
import { browseSources } from "#/modules/locality/features/places/reads/sources.ts";

/**
 * The data sources behind the platform, with their publisher and how many artifacts and citations each has.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 */
@Injectable()
export class BrowseSourcesUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: SourceSearchInputDto): Promise<SourceCollectionDto> {
    return { sources: await browseSources(this.db, input.query, input.limit ?? 50) };
  }
}
