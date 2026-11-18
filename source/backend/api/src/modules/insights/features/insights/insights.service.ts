import { Injectable } from "@nestjs/common";
import type { BoardInputDto } from "#/modules/insights/schema/dto/board-input.dto.ts";
import type { BrowseInputDto } from "#/modules/insights/schema/dto/browse-input.dto.ts";
import type { CodeInputDto } from "#/modules/insights/schema/dto/code-input.dto.ts";
import type { ElectionDetailDto } from "#/modules/insights/schema/dto/election-detail.dto.ts";
import type { ElectionInputDto } from "#/modules/insights/schema/dto/election-input.dto.ts";
import type { ElectionListDto } from "#/modules/insights/schema/dto/election-list.dto.ts";
import type { IdInputDto } from "#/modules/insights/schema/dto/id-input.dto.ts";
import type { IndicatorMapDto } from "#/modules/insights/schema/dto/indicator-map.dto.ts";
import type { IndicatorSeriesDto } from "#/modules/insights/schema/dto/indicator-series.dto.ts";
import type { LeaderProfileDto } from "#/modules/insights/schema/dto/leader-profile.dto.ts";
import type { LeaderboardMetricListDto } from "#/modules/insights/schema/dto/leaderboard-metric-list.dto.ts";
import type { LeaderboardDto } from "#/modules/insights/schema/dto/leaderboard.dto.ts";
import type { MapInputDto } from "#/modules/insights/schema/dto/map-input.dto.ts";
import type { MotionDetailDto } from "#/modules/insights/schema/dto/motion-detail.dto.ts";
import type { MotionListDto } from "#/modules/insights/schema/dto/motion-list.dto.ts";
import type { MotionsInputDto } from "#/modules/insights/schema/dto/motions-input.dto.ts";
import type { NearbyInputDto } from "#/modules/insights/schema/dto/nearby-input.dto.ts";
import type { NearbyProjectsDto } from "#/modules/insights/schema/dto/nearby-projects.dto.ts";
import type { PartyDetailDto } from "#/modules/insights/schema/dto/party-detail.dto.ts";
import type { PartyListDto } from "#/modules/insights/schema/dto/party-list.dto.ts";
import type { PlaceBrowseDto } from "#/modules/insights/schema/dto/place-browse.dto.ts";
import type { PlaceCivicDto } from "#/modules/insights/schema/dto/place-civic.dto.ts";
import type { PlaceElectionsDto } from "#/modules/insights/schema/dto/place-elections.dto.ts";
import type { PlaceOnlyDto } from "#/modules/insights/schema/dto/place-only.dto.ts";
import type { PlaceStatisticsDto } from "#/modules/insights/schema/dto/place-statistics.dto.ts";
import type { ProjectDetailDto } from "#/modules/insights/schema/dto/project-detail.dto.ts";
import type { SearchQueryDto } from "#/modules/insights/schema/dto/search-query.dto.ts";
import type { SearchResultsDto } from "#/modules/insights/schema/dto/search-results.dto.ts";
import type { SeriesInputDto } from "#/modules/insights/schema/dto/series-input.dto.ts";
import type { TenderInputDto } from "#/modules/insights/schema/dto/tender-input.dto.ts";
import type { TenderListDto } from "#/modules/insights/schema/dto/tender-list.dto.ts";
import { BrowsePlacesUseCase } from "#/modules/insights/features/insights/use-cases/browse-places.usecase.ts";
import { GetElectionUseCase } from "#/modules/insights/features/insights/use-cases/get-election.usecase.ts";
import { GetIndicatorMapUseCase } from "#/modules/insights/features/insights/use-cases/get-indicator-map.usecase.ts";
import { GetIndicatorSeriesUseCase } from "#/modules/insights/features/insights/use-cases/get-indicator-series.usecase.ts";
import { GetLeaderProfileUseCase } from "#/modules/insights/features/insights/use-cases/get-leader-profile.usecase.ts";
import { GetLeaderboardUseCase } from "#/modules/insights/features/insights/use-cases/get-leaderboard.usecase.ts";
import { GetMotionUseCase } from "#/modules/insights/features/insights/use-cases/get-motion.usecase.ts";
import { GetNearbyProjectsUseCase } from "#/modules/insights/features/insights/use-cases/get-nearby-projects.usecase.ts";
import { GetPartyUseCase } from "#/modules/insights/features/insights/use-cases/get-party.usecase.ts";
import { GetPlaceCivicUseCase } from "#/modules/insights/features/insights/use-cases/get-place-civic.usecase.ts";
import { GetPlaceElectionsUseCase } from "#/modules/insights/features/insights/use-cases/get-place-elections.usecase.ts";
import { GetPlaceStatisticsUseCase } from "#/modules/insights/features/insights/use-cases/get-place-statistics.usecase.ts";
import { GetProjectUseCase } from "#/modules/insights/features/insights/use-cases/get-project.usecase.ts";
import { GlobalSearchUseCase } from "#/modules/insights/features/insights/use-cases/global-search.usecase.ts";
import { ListElectionsUseCase } from "#/modules/insights/features/insights/use-cases/list-elections.usecase.ts";
import { ListLeaderboardMetricsUseCase } from "#/modules/insights/features/insights/use-cases/list-leaderboard-metrics.usecase.ts";
import { ListMotionsUseCase } from "#/modules/insights/features/insights/use-cases/list-motions.usecase.ts";
import { ListPartiesUseCase } from "#/modules/insights/features/insights/use-cases/list-parties.usecase.ts";
import { ListTendersUseCase } from "#/modules/insights/features/insights/use-cases/list-tenders.usecase.ts";

/**
 * The Insights contract the controller calls, then its implementation: each method
 * delegates to the use case for that operation. Regenerated by Dryv; the use cases hold the logic.
 */
export abstract class InsightsInsightsService {
  abstract browsePlaces(input: BrowseInputDto): Promise<PlaceBrowseDto>;
  abstract getElection(input: ElectionInputDto): Promise<ElectionDetailDto>;
  abstract getIndicatorMap(input: MapInputDto): Promise<IndicatorMapDto>;
  abstract getIndicatorSeries(input: SeriesInputDto): Promise<IndicatorSeriesDto>;
  abstract getLeaderProfile(input: IdInputDto): Promise<LeaderProfileDto>;
  abstract getLeaderboard(input: BoardInputDto): Promise<LeaderboardDto>;
  abstract getMotion(input: CodeInputDto): Promise<MotionDetailDto>;
  abstract getNearbyProjects(input: NearbyInputDto): Promise<NearbyProjectsDto>;
  abstract getParty(input: CodeInputDto): Promise<PartyDetailDto>;
  abstract getPlaceCivic(input: PlaceOnlyDto): Promise<PlaceCivicDto>;
  abstract getPlaceElections(input: PlaceOnlyDto): Promise<PlaceElectionsDto>;
  abstract getPlaceStatistics(input: PlaceOnlyDto): Promise<PlaceStatisticsDto>;
  abstract getProject(input: CodeInputDto): Promise<ProjectDetailDto>;
  abstract globalSearch(input: SearchQueryDto): Promise<SearchResultsDto>;
  abstract listElections(): Promise<ElectionListDto>;
  abstract listLeaderboardMetrics(): Promise<LeaderboardMetricListDto>;
  abstract listMotions(input: MotionsInputDto): Promise<MotionListDto>;
  abstract listParties(): Promise<PartyListDto>;
  abstract listTenders(input: TenderInputDto): Promise<TenderListDto>;
}

@Injectable()
export class InsightsInsightsServiceImpl extends InsightsInsightsService {
  constructor(
    private readonly browsePlacesUseCase: BrowsePlacesUseCase,
    private readonly getElectionUseCase: GetElectionUseCase,
    private readonly getIndicatorMapUseCase: GetIndicatorMapUseCase,
    private readonly getIndicatorSeriesUseCase: GetIndicatorSeriesUseCase,
    private readonly getLeaderProfileUseCase: GetLeaderProfileUseCase,
    private readonly getLeaderboardUseCase: GetLeaderboardUseCase,
    private readonly getMotionUseCase: GetMotionUseCase,
    private readonly getNearbyProjectsUseCase: GetNearbyProjectsUseCase,
    private readonly getPartyUseCase: GetPartyUseCase,
    private readonly getPlaceCivicUseCase: GetPlaceCivicUseCase,
    private readonly getPlaceElectionsUseCase: GetPlaceElectionsUseCase,
    private readonly getPlaceStatisticsUseCase: GetPlaceStatisticsUseCase,
    private readonly getProjectUseCase: GetProjectUseCase,
    private readonly globalSearchUseCase: GlobalSearchUseCase,
    private readonly listElectionsUseCase: ListElectionsUseCase,
    private readonly listLeaderboardMetricsUseCase: ListLeaderboardMetricsUseCase,
    private readonly listMotionsUseCase: ListMotionsUseCase,
    private readonly listPartiesUseCase: ListPartiesUseCase,
    private readonly listTendersUseCase: ListTendersUseCase,
  ) {
    super();
  }

  browsePlaces(input: BrowseInputDto): Promise<PlaceBrowseDto> {
    return this.browsePlacesUseCase.execute(input);
  }

  getElection(input: ElectionInputDto): Promise<ElectionDetailDto> {
    return this.getElectionUseCase.execute(input);
  }

  getIndicatorMap(input: MapInputDto): Promise<IndicatorMapDto> {
    return this.getIndicatorMapUseCase.execute(input);
  }

  getIndicatorSeries(input: SeriesInputDto): Promise<IndicatorSeriesDto> {
    return this.getIndicatorSeriesUseCase.execute(input);
  }

  getLeaderProfile(input: IdInputDto): Promise<LeaderProfileDto> {
    return this.getLeaderProfileUseCase.execute(input);
  }

  getLeaderboard(input: BoardInputDto): Promise<LeaderboardDto> {
    return this.getLeaderboardUseCase.execute(input);
  }

  getMotion(input: CodeInputDto): Promise<MotionDetailDto> {
    return this.getMotionUseCase.execute(input);
  }

  getNearbyProjects(input: NearbyInputDto): Promise<NearbyProjectsDto> {
    return this.getNearbyProjectsUseCase.execute(input);
  }

  getParty(input: CodeInputDto): Promise<PartyDetailDto> {
    return this.getPartyUseCase.execute(input);
  }

  getPlaceCivic(input: PlaceOnlyDto): Promise<PlaceCivicDto> {
    return this.getPlaceCivicUseCase.execute(input);
  }

  getPlaceElections(input: PlaceOnlyDto): Promise<PlaceElectionsDto> {
    return this.getPlaceElectionsUseCase.execute(input);
  }

  getPlaceStatistics(input: PlaceOnlyDto): Promise<PlaceStatisticsDto> {
    return this.getPlaceStatisticsUseCase.execute(input);
  }

  getProject(input: CodeInputDto): Promise<ProjectDetailDto> {
    return this.getProjectUseCase.execute(input);
  }

  globalSearch(input: SearchQueryDto): Promise<SearchResultsDto> {
    return this.globalSearchUseCase.execute(input);
  }

  listElections(): Promise<ElectionListDto> {
    return this.listElectionsUseCase.execute();
  }

  listLeaderboardMetrics(): Promise<LeaderboardMetricListDto> {
    return this.listLeaderboardMetricsUseCase.execute();
  }

  listMotions(input: MotionsInputDto): Promise<MotionListDto> {
    return this.listMotionsUseCase.execute(input);
  }

  listParties(): Promise<PartyListDto> {
    return this.listPartiesUseCase.execute();
  }

  listTenders(input: TenderInputDto): Promise<TenderListDto> {
    return this.listTendersUseCase.execute(input);
  }
}
