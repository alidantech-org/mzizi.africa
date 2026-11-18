import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { CompareOptionsInputDto } from "#/modules/insights/schema/dto/compare-options-input.dto";
import type { CompareOptionsDto } from "#/modules/insights/schema/dto/compare-options.dto";
import { compareOptions } from "#/modules/insights/features/insights/reads/compare.ts";

/** Scaffolded by Dryv once; this file belongs to the project. The read lives in `reads/`. */
@Injectable()
export class GetCompareOptionsUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: CompareOptionsInputDto): Promise<CompareOptionsDto> {
    return (await compareOptions(this.db, input.featureId, input.metric)) as unknown as CompareOptionsDto;
  }
}
