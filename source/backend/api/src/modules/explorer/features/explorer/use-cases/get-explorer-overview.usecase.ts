import { DataSource } from "typeorm";
import { overview } from "#/modules/explorer/features/explorer/reads/explorer.ts";
import { Injectable } from "@nestjs/common";
import type { OverviewDto } from "#/modules/explorer/schema/dto/overview.dto";
import type { PlaceInputDto } from "#/modules/explorer/schema/dto/place-input.dto";

/**
 * One place's context, direct children and recorded coverage counts; never substitutes demonstration measures.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Delegates composition to the project-owned typed reader.
 */
@Injectable()
export class GetExplorerOverviewUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: PlaceInputDto): Promise<OverviewDto> {
    return overview(this.db, input);
  }
}
