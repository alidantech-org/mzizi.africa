import { DataSource } from "typeorm";
import { children } from "#/modules/explorer/features/explorer/reads/explorer.ts";
import { Injectable } from "@nestjs/common";
import type { ChildrenInputDto } from "#/modules/explorer/schema/dto/children-input.dto";
import type { PlacesDto } from "#/modules/explorer/schema/dto/places.dto";

/**
 * Direct children in the recorded routing hierarchy of one explicit country.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Delegates composition to the project-owned typed reader.
 */
@Injectable()
export class ListExplorerChildrenUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: ChildrenInputDto): Promise<PlacesDto> {
    return children(this.db, input);
  }
}
