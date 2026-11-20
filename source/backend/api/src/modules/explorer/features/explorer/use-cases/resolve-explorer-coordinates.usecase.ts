import { DataSource } from "typeorm";
import { resolve } from "#/modules/explorer/features/explorer/reads/explorer.ts";
import { Injectable } from "@nestjs/common";
import type { CoordinatesInputDto } from "#/modules/explorer/schema/dto/coordinates-input.dto";
import type { ResolutionDto } from "#/modules/explorer/schema/dto/resolution.dto";

/**
 * Read geographic candidates from recorded boundaries. POST keeps device coordinates out of shared query strings; it performs no writes.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Delegates composition to the project-owned typed reader.
 */
@Injectable()
export class ResolveExplorerCoordinatesUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: CoordinatesInputDto): Promise<ResolutionDto> {
    return resolve(this.db, input);
  }
}
