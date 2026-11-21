import { DataSource } from "typeorm";
import { boundaries } from "#/modules/explorer/features/explorer/reads/boundaries.ts";
import { Injectable } from "@nestjs/common";
import type { BoundariesInputDto } from "#/modules/explorer/schema/dto/boundaries-input.dto";
import type { BoundariesDto } from "#/modules/explorer/schema/dto/boundaries.dto";

/**
 * Simplified boundaries to draw a map: the place itself or the places directly inside it, from the recorded geometries, resolved from the readable address. Places with no recorded boundary are counted, never drawn.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Delegates composition to the project-owned typed reader.
 */
@Injectable()
export class GetExplorerBoundariesUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: BoundariesInputDto): Promise<BoundariesDto> {
    return boundaries(this.db, input);
  }
}
