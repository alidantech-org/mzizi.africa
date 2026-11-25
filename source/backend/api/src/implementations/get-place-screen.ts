/**
 * The place page in one call: the place (or the country itself), its breadcrumb, divisions, headline figures, leaders,
 * projects, upcoming events and articles, every text localized with the country's language chain.
 */
import { Injectable, NotFoundException, Optional } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PersistenceRuntime } from "#/database/persistence/persistence.runtime";
import { listPlaceProjectsRepository } from "#/modules/civic/features/delivery/use-cases/list-place-projects.repository";
import { PlaceProjectsDto } from "#/modules/civic/schema/dto/place-projects.dto";
import { listOccurrencesRepository } from "#/modules/event/features/calendar/use-cases/list-occurrences.repository";
import { CalendarWindowDto } from "#/modules/event/schema/dto/calendar-window.dto";
import type { PlaceRequestDto } from "#/modules/frontend/schema/dto/place-request.dto";
import { PlaceScreenDto } from "#/modules/frontend/schema/dto/place-screen.dto";
import { getPlaceRepository } from "#/modules/geography/features/places/use-cases/get-place.repository";
import { listChildrenRepository } from "#/modules/geography/features/places/use-cases/list-children.repository";
import { ChildWindowDto } from "#/modules/geography/schema/dto/child-window.dto";
import { FeatureKeyDto } from "#/modules/geography/schema/dto/feature-key.dto";
import type { PlaceDetailDto } from "#/modules/geography/schema/dto/place-detail.dto";
import { listPlaceOfficesRepository } from "#/modules/governance/features/seats/use-cases/list-place-offices.repository";
import { PlaceOfficesDto } from "#/modules/governance/schema/dto/place-offices.dto";
import { listArticlesRepository } from "#/modules/media/features/library/use-cases/list-articles.repository";
import { IdentityMediaDto } from "#/modules/media/schema/dto/identity-media.dto";
import { listIndicatorsRepository } from "#/modules/statistics/features/indicators/use-cases/list-indicators.repository";
import { listPlaceFiguresRepository } from "#/modules/statistics/features/figures/use-cases/list-place-figures.repository";
import { IndicatorWindowDto } from "#/modules/statistics/schema/dto/indicator-window.dto";
import { PlaceFiguresDto } from "#/modules/statistics/schema/dto/place-figures.dto";
import { call } from "./shared/call";
import { loadCountry } from "./shared/country";

/** How many breadcrumb steps a place page climbs at most. */
const MAX_DEPTH = 8;

@Injectable()
export class GetPlaceScreenUseCase {
  /** Optional so HTTP specs can mock the service; the application registers the runtime globally. */
  constructor(@Optional() private readonly injected?: PersistenceRuntime) {}

  private get runtime(): PersistenceRuntime {
    if (!this.injected) throw new Error("PersistenceRuntime must be registered");
    return this.injected;
  }

  private async place(code: string): Promise<PlaceDetailDto | undefined> {
    try {
      return await call(this.runtime, getPlaceRepository, FeatureKeyDto, { code });
    } catch {
      return undefined;
    }
  }

  async execute(input: PlaceRequestDto): Promise<PlaceScreenDto> {
    const { country, chain, languages } = await loadCountry(this.runtime, input.country, input.lang);
    const detail = input.place ? await this.place(input.place) : undefined;
    if (input.place && !detail) throw new NotFoundException(`place ${input.place} not found`);
    const featureId = detail?.featureId ?? country.countryId;
    const placeName = detail ? chain.must(detail.names, detail.code) : chain.must(country.names, country.code);

    const breadcrumb: { id: string; code: string; name: ReturnType<typeof chain.must> }[] = [];
    let cursor = detail;
    for (let depth = 0; cursor && depth < MAX_DEPTH; depth++) {
      const parent = cursor.parents.find((p) => p.toYear === null && p.depth !== null) ?? cursor.parents.find((p) => p.toYear === null);
      if (!parent) break;
      cursor = await this.place(parent.parentCode);
      if (cursor) breadcrumb.unshift({ id: cursor.featureId, code: cursor.code, name: chain.must(cursor.names, cursor.code) });
    }

    const today = new Date().toISOString().slice(0, 10);
    const [children, figures, indicators, offices, projects, events, articles] = await Promise.all([
      call(this.runtime, listChildrenRepository, ChildWindowDto, { parentId: featureId, limit: 200, offset: 0 }),
      call(this.runtime, listPlaceFiguresRepository, PlaceFiguresDto, { countryId: country.countryId, featureId, limit: 200, offset: 0 }),
      call(this.runtime, listIndicatorsRepository, IndicatorWindowDto, { limit: 200, offset: 0 }),
      call(this.runtime, listPlaceOfficesRepository, PlaceOfficesDto, { featureId, limit: 50, offset: 0 }),
      call(this.runtime, listPlaceProjectsRepository, PlaceProjectsDto, { featureId, limit: 10, offset: 0 }),
      call(this.runtime, listOccurrencesRepository, CalendarWindowDto, { countryId: country.countryId, from: today, limit: 5, offset: 0 }),
      call(this.runtime, listArticlesRepository, IdentityMediaDto, { identityId: featureId, limit: 5, offset: 0 }),
    ]);

    const indicatorById = new Map(indicators.indicators.map((i) => [i.indicatorId, i]));
    const latest = new Map<string, (typeof figures.figures)[number]>();
    for (const figure of figures.figures) {
      if (figure.cell !== "" || !figure.indicatorId || latest.has(figure.indicatorId)) continue;
      latest.set(figure.indicatorId, figure);
    }

    return plainToInstance(PlaceScreenDto, {
      country: { id: country.countryId, code: country.code, isoAlpha2: country.isoAlpha2, name: chain.must(country.names, country.code) },
      place: { id: featureId, code: detail?.code ?? country.code, name: placeName },
      language: chain.primary,
      languages: country.locales.map((l) => {
        const language = languages.find((x) => x.code === l.languageCode);
        return { code: l.languageCode, tag: l.languageIso ?? l.languageCode, name: chain.must(language?.names, l.languageCode), direction: "ltr" };
      }),
      breadcrumb,
      // A place can sit in several hierarchies (administrative and electoral); each division is shown once.
      children: [...new Map(children.children.map((c) => [c.code, c])).values()].map((c) => ({ id: c.featureId, code: c.code, name: chain.must(c.names, c.code) })),
      figures: [...latest.values()].map((f) => {
        const indicator = f.indicatorId ? indicatorById.get(f.indicatorId) : undefined;
        return {
          indicator: f.indicatorCode ?? indicator?.code ?? "",
          label: chain.must(indicator?.names, f.indicatorCode ?? ""),
          value: f.value,
          lower: f.lower,
          upper: f.upper,
          unit: indicator?.unitSymbol ?? null,
          decimals: indicator?.decimals ?? null,
          fromYear: f.fromYear,
          toYear: f.toYear,
          status: f.status,
          basis: f.basis,
        };
      }),
      leaders: offices.offices.map((o) => {
        const current = o.holders.find((h) => h.toYear === null);
        return {
          office: o.code,
          officeName: chain.must(o.names, o.code),
          person: current?.individualCode ?? null,
          personName: current ? chain.pick(current.names) : undefined,
          fromYear: current?.fromYear ?? null,
        };
      }),
      projects: projects.projects.map((p) => ({ code: p.code, name: chain.must(p.names, p.code) })),
      events: events.occurrences.map((e) => ({ code: e.eventCode, name: chain.must(e.names, e.eventCode), startsOn: e.plannedStartsOn })),
      articles: articles.articles.map((a) => ({
        code: a.code,
        title: chain.must(
          a.titles.map((t) => ({ text: t.title, languageCode: t.languageCode, isDefault: t.origin === "original" })),
          a.code,
        ),
      })),
    });
  }
}
