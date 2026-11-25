/**
 * One indicator across the first-level places of a country (its direct divisions, so like is compared with like),
 * ranked for one year (the latest when none is asked for).
 */
import { Injectable, NotFoundException, Optional } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PersistenceRuntime } from "#/database/persistence/persistence.runtime";
import type { RankingRequestDto } from "#/modules/frontend/schema/dto/ranking-request.dto";
import { RankingScreenDto } from "#/modules/frontend/schema/dto/ranking-screen.dto";
import { listChildrenRepository } from "#/modules/geography/features/places/use-cases/list-children.repository";
import { ChildWindowDto } from "#/modules/geography/schema/dto/child-window.dto";
import { getIndicatorRepository } from "#/modules/statistics/features/indicators/use-cases/get-indicator.repository";
import { listIndicatorFiguresRepository } from "#/modules/statistics/features/figures/use-cases/list-indicator-figures.repository";
import { listPlaceFiguresRepository } from "#/modules/statistics/features/figures/use-cases/list-place-figures.repository";
import { PlaceFiguresDto } from "#/modules/statistics/schema/dto/place-figures.dto";
import type { IndicatorDetailDto } from "#/modules/statistics/schema/dto/indicator-detail.dto";
import { IndicatorFiguresDto } from "#/modules/statistics/schema/dto/indicator-figures.dto";
import { IndicatorKeyDto } from "#/modules/statistics/schema/dto/indicator-key.dto";
import { call } from "./shared/call";
import { loadCountry } from "./shared/country";

@Injectable()
export class GetRankingScreenUseCase {
  /** Optional so HTTP specs can mock the service; the application registers the runtime globally. */
  constructor(@Optional() private readonly injected?: PersistenceRuntime) {}

  private get runtime(): PersistenceRuntime {
    if (!this.injected) throw new Error("PersistenceRuntime must be registered");
    return this.injected;
  }

  async execute(input: RankingRequestDto): Promise<RankingScreenDto> {
    const { country, chain } = await loadCountry(this.runtime, input.country, input.lang);
    let indicator: IndicatorDetailDto;
    try {
      indicator = await call(this.runtime, getIndicatorRepository, IndicatorKeyDto, { code: input.indicator });
    } catch {
      throw new NotFoundException(`indicator ${input.indicator} not found`);
    }
    const children = await call(this.runtime, listChildrenRepository, ChildWindowDto, { parentId: country.countryId, limit: 200, offset: 0 });
    const placeById = new Map(children.children.map((c) => [c.featureId, c]));
    // The latest year comes from one first-level place, so only one year of every place is read.
    const sample = children.children[0]?.featureId ?? country.countryId;
    const national = await call(this.runtime, listPlaceFiguresRepository, PlaceFiguresDto, {
      countryId: country.countryId,
      featureId: sample,
      indicatorId: indicator.indicatorId,
      limit: 50,
      offset: 0,
    });
    const latest = national.figures.find((f) => f.cell === "")?.fromYear ?? undefined;
    const figures = await call(this.runtime, listIndicatorFiguresRepository, IndicatorFiguresDto, {
      countryId: country.countryId,
      indicatorId: indicator.indicatorId,
      fromYear: input.year ?? latest,
      limit: 5000,
      offset: 0,
    });
    const totals = figures.figures.filter((f) => f.cell === "" && placeById.has(f.featureId));
    const year = input.year ?? Math.max(...totals.map((f) => f.fromYear ?? Number.NEGATIVE_INFINITY));
    const rows = totals.filter((f) => f.fromYear === year);
    const direction = indicator.higherIsBetter === false ? 1 : -1;
    const ranked = [...rows].sort((a, b) => direction * ((a.value ?? 0) - (b.value ?? 0)));
    return plainToInstance(RankingScreenDto, {
      language: chain.primary,
      indicator: chain.must(indicator.names, indicator.code),
      unit: indicator.unitSymbol ?? null,
      year: Number.isFinite(year) ? year : null,
      rows: ranked.map((f, index) => {
        const place = placeById.get(f.featureId);
        return {
          place: place?.code ?? f.featureId,
          name: chain.must(place?.names, place?.code ?? f.featureId),
          value: f.value,
          rank: f.value === null ? null : index + 1,
          status: f.status,
        };
      }),
    });
  }
}
