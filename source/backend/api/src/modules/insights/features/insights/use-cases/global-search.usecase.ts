import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { SearchQueryDto } from "#/modules/insights/schema/dto/search-query.dto";
import type { SearchResultsDto } from "#/modules/insights/schema/dto/search-results.dto";
import { globalSearch } from "#/modules/insights/features/insights/reads/search.ts";

/** Scaffolded by Dryv once; this file belongs to the project. The query lives in `reads/search.ts`. */
@Injectable()
export class GlobalSearchUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: SearchQueryDto): Promise<SearchResultsDto> {
    return (await globalSearch(this.db, input.query, input.kinds, input.limit ?? 30)) as unknown as SearchResultsDto;
  }
}
