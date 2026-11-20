import { DataSource } from "typeorm";
import { context } from "#/modules/explorer/features/explorer/reads/explorer.ts";
import { Injectable } from "@nestjs/common";
import type { ContextDto } from "#/modules/explorer/schema/dto/context.dto";
import type { PlaceInputDto } from "#/modules/explorer/schema/dto/place-input.dto";

/**
 * Resolve an explicit country and registered place path or identity; incompatible identities are rejected.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Delegates composition to the project-owned typed reader.
 */
@Injectable()
export class GetExplorerContextUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: PlaceInputDto): Promise<ContextDto> {
    return context(this.db, input);
  }
}
