import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import { featureIdAt } from "#/modules/explorer/features/explorer/reads/explorer.ts";
import type { ComparisonAtInputDto } from "#/modules/insights/schema/dto/comparison-at-input.dto";
import type { ComparisonDto } from "#/modules/insights/schema/dto/comparison.dto";
import { comparison } from "#/modules/insights/features/insights/reads/compare.ts";

/** Two places of one country on the same figures, each by its readable address. Scaffolded by Dryv once; this file belongs to the project. */
@Injectable()
export class GetComparisonAtUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: ComparisonAtInputDto): Promise<ComparisonDto> {
    const [a, b] = await Promise.all([
      featureIdAt(this.db, input.countryCode, input.a, input.languageCode),
      featureIdAt(this.db, input.countryCode, input.b, input.languageCode),
    ]);
    return (await comparison(this.db, a, b, input.metrics)) as unknown as ComparisonDto;
  }
}
