import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import { featureIdAt } from "#/modules/explorer/features/explorer/reads/explorer.ts";
import type { CompareOptionsAtInputDto } from "#/modules/insights/schema/dto/compare-options-at-input.dto";
import type { CompareOptionsDto } from "#/modules/insights/schema/dto/compare-options.dto";
import { compareOptions } from "#/modules/insights/features/insights/reads/compare.ts";

/** Compare options for a place named by its readable address. Scaffolded by Dryv once; this file belongs to the project. */
@Injectable()
export class GetCompareOptionsAtUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: CompareOptionsAtInputDto): Promise<CompareOptionsDto> {
    const featureId = await featureIdAt(this.db, input.countryCode, input.path, input.languageCode);
    return (await compareOptions(this.db, featureId, input.metric)) as unknown as CompareOptionsDto;
  }
}
