import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { ComparisonInputDto } from "#/modules/insights/schema/dto/comparison-input.dto";
import type { ComparisonDto } from "#/modules/insights/schema/dto/comparison.dto";
import { comparison } from "#/modules/insights/features/insights/reads/compare.ts";

/** Scaffolded by Dryv once; this file belongs to the project. The read lives in `reads/`. */
@Injectable()
export class GetComparisonUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: ComparisonInputDto): Promise<ComparisonDto> {
    return (await comparison(this.db, input.a, input.b, input.metrics)) as unknown as ComparisonDto;
  }
}
