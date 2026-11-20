import { DataSource } from "typeorm";
import { navigation } from "#/modules/explorer/features/explorer/reads/explorer.ts";
import { Injectable } from "@nestjs/common";
import type { NavigationInputDto } from "#/modules/explorer/schema/dto/navigation-input.dto";
import type { NavigationDto } from "#/modules/explorer/schema/dto/navigation.dto";

/**
 * Which navigation subjects have recorded data for one explicit country. Availability follows the data, not a list kept by the client.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Delegates composition to the project-owned typed reader.
 */
@Injectable()
export class GetExplorerNavigationUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: NavigationInputDto): Promise<NavigationDto> {
    return navigation(this.db, input);
  }
}
