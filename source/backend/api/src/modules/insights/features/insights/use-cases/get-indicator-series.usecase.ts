import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { SeriesInputDto } from "#/modules/insights/schema/dto/series-input.dto";
import type { IndicatorSeriesDto } from "#/modules/insights/schema/dto/indicator-series.dto";
import { indicatorSeries } from "#/modules/insights/features/insights/reads/statistics.ts";

/** Scaffolded by Dryv once; this file belongs to the project. The query lives in `reads/statistics.ts`. */
@Injectable()
export class GetIndicatorSeriesUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: SeriesInputDto): Promise<IndicatorSeriesDto> {
    return (await indicatorSeries(this.db, input.indicatorCode, input.featureId)) as unknown as IndicatorSeriesDto;
  }
}
