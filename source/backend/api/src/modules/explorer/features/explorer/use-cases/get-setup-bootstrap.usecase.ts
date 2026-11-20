import { DataSource } from "typeorm";
import { bootstrap } from "#/modules/explorer/features/explorer/reads/explorer.ts";
import { Injectable } from "@nestjs/common";
import type { BootstrapInputDto } from "#/modules/explorer/schema/dto/bootstrap-input.dto";
import type { BootstrapDto } from "#/modules/explorer/schema/dto/bootstrap.dto";

/**
 * Country catalogue, available interface languages and recorded copy. Never chooses a default country.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Delegates composition to the project-owned typed reader.
 */
@Injectable()
export class GetSetupBootstrapUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: BootstrapInputDto): Promise<BootstrapDto> {
    return bootstrap(this.db, input);
  }
}
