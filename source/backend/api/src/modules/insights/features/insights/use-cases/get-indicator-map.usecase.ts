import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import type { MapInputDto } from "#/modules/insights/schema/dto/map-input.dto";
import type { IndicatorMapDto } from "#/modules/insights/schema/dto/indicator-map.dto";
import { indicatorMap } from "#/modules/insights/features/insights/reads/statistics.ts";

/** Scaffolded by Dryv once; this file belongs to the project. The query lives in `reads/statistics.ts`. */
@Injectable()
export class GetIndicatorMapUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: MapInputDto): Promise<IndicatorMapDto> {
    return (await indicatorMap(this.db, input.indicatorCode, input.parentFeatureId, input.kindCode)) as unknown as IndicatorMapDto;
  }
}
