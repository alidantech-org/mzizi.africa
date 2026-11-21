import { Injectable } from "@nestjs/common";
import type { BoardInputDto } from "#/modules/insights/schema/dto/board-input.dto.ts";
import type { BrowseInputDto } from "#/modules/insights/schema/dto/browse-input.dto.ts";
import type { CodeInputDto } from "#/modules/insights/schema/dto/code-input.dto.ts";
import type { CompareOptionsInputDto } from "#/modules/insights/schema/dto/compare-options-input.dto.ts";
import type { CompareOptionsDto } from "#/modules/insights/schema/dto/compare-options.dto.ts";
import type { ComparisonInputDto } from "#/modules/insights/schema/dto/comparison-input.dto.ts";
import type { ComparisonDto } from "#/modules/insights/schema/dto/comparison.dto.ts";
import type { ContentInputDto } from "#/modules/insights/schema/dto/content-input.dto.ts";
import type { ContentListInputDto } from "#/modules/insights/schema/dto/content-list-input.dto.ts";
import type { ContentListDto } from "#/modules/insights/schema/dto/content-list.dto.ts";
import type { ContentPageDto } from "#/modules/insights/schema/dto/content-page.dto.ts";
import type { ElectionDetailDto } from "#/modules/insights/schema/dto/election-detail.dto.ts";
import type { ElectionInputDto } from "#/modules/insights/schema/dto/election-input.dto.ts";
import type { ElectionListDto } from "#/modules/insights/schema/dto/election-list.dto.ts";
import type { GovTreeInputDto } from "#/modules/insights/schema/dto/gov-tree-input.dto.ts";
import type { GovernanceTabsDto } from "#/modules/insights/schema/dto/governance-tabs.dto.ts";
import type { GovernanceTreeDto } from "#/modules/insights/schema/dto/governance-tree.dto.ts";
import type { IndicatorMapDto } from "#/modules/insights/schema/dto/indicator-map.dto.ts";
import type { IndicatorSeriesDto } from "#/modules/insights/schema/dto/indicator-series.dto.ts";
import type { InstitutionDetailDto } from "#/modules/insights/schema/dto/institution-detail.dto.ts";
import type { InstitutionListDto } from "#/modules/insights/schema/dto/institution-list.dto.ts";
import type { InstitutionsInputDto } from "#/modules/insights/schema/dto/institutions-input.dto.ts";
import type { LawInputDto } from "#/modules/insights/schema/dto/law-input.dto.ts";
import type { LawListDto } from "#/modules/insights/schema/dto/law-list.dto.ts";
import type { LeaderProfileDto } from "#/modules/insights/schema/dto/leader-profile.dto.ts";
import type { LeaderTreeDto } from "#/modules/insights/schema/dto/leader-tree.dto.ts";
import type { LeaderboardMetricListDto } from "#/modules/insights/schema/dto/leaderboard-metric-list.dto.ts";
import type { LeaderboardDto } from "#/modules/insights/schema/dto/leaderboard.dto.ts";
import type { LegalBasisInputDto } from "#/modules/insights/schema/dto/legal-basis-input.dto.ts";
import type { LegalBasisDto } from "#/modules/insights/schema/dto/legal-basis.dto.ts";
import type { MapInputDto } from "#/modules/insights/schema/dto/map-input.dto.ts";
import type { MotionDetailDto } from "#/modules/insights/schema/dto/motion-detail.dto.ts";
import type { MotionListDto } from "#/modules/insights/schema/dto/motion-list.dto.ts";
import type { MotionsInputDto } from "#/modules/insights/schema/dto/motions-input.dto.ts";
import type { NearbyInputDto } from "#/modules/insights/schema/dto/nearby-input.dto.ts";
import type { NearbyProjectsDto } from "#/modules/insights/schema/dto/nearby-projects.dto.ts";
import type { PartyDetailDto } from "#/modules/insights/schema/dto/party-detail.dto.ts";
import type { PartyListDto } from "#/modules/insights/schema/dto/party-list.dto.ts";
import type { PlaceAtDto } from "#/modules/insights/schema/dto/place-at.dto.ts";
import type { PlaceBrowseDto } from "#/modules/insights/schema/dto/place-browse.dto.ts";
import type { PlaceCivicDto } from "#/modules/insights/schema/dto/place-civic.dto.ts";
import type { PlaceElectionsDto } from "#/modules/insights/schema/dto/place-elections.dto.ts";
import type { PlaceOnlyDto } from "#/modules/insights/schema/dto/place-only.dto.ts";
import type { PlaceStatisticsInputDto } from "#/modules/insights/schema/dto/place-statistics-input.dto.ts";
import type { PlaceStatisticsDto } from "#/modules/insights/schema/dto/place-statistics.dto.ts";
import type { ProjectDetailDto } from "#/modules/insights/schema/dto/project-detail.dto.ts";
import type { SearchQueryDto } from "#/modules/insights/schema/dto/search-query.dto.ts";
import type { SearchResultsDto } from "#/modules/insights/schema/dto/search-results.dto.ts";
import type { SeriesInputDto } from "#/modules/insights/schema/dto/series-input.dto.ts";
import type { TenderInputDto } from "#/modules/insights/schema/dto/tender-input.dto.ts";
import type { TenderListDto } from "#/modules/insights/schema/dto/tender-list.dto.ts";
import type { TreeInputDto } from "#/modules/insights/schema/dto/tree-input.dto.ts";
import { BrowsePlacesUseCase } from "#/modules/insights/features/insights/use-cases/browse-places.usecase.ts";
import { GetCompareOptionsUseCase } from "#/modules/insights/features/insights/use-cases/get-compare-options.usecase.ts";
import { GetComparisonUseCase } from "#/modules/insights/features/insights/use-cases/get-comparison.usecase.ts";
import { GetContentUseCase } from "#/modules/insights/features/insights/use-cases/get-content.usecase.ts";
import { GetElectionUseCase } from "#/modules/insights/features/insights/use-cases/get-election.usecase.ts";
import { GetGovernanceTabsUseCase } from "#/modules/insights/features/insights/use-cases/get-governance-tabs.usecase.ts";
import { GetGovernanceTreeUseCase } from "#/modules/insights/features/insights/use-cases/get-governance-tree.usecase.ts";
import { GetIndicatorMapUseCase } from "#/modules/insights/features/insights/use-cases/get-indicator-map.usecase.ts";
import { GetIndicatorSeriesUseCase } from "#/modules/insights/features/insights/use-cases/get-indicator-series.usecase.ts";
import { GetInstitutionUseCase } from "#/modules/insights/features/insights/use-cases/get-institution.usecase.ts";
import { GetLeaderProfileUseCase } from "#/modules/insights/features/insights/use-cases/get-leader-profile.usecase.ts";
import { GetLeaderTreeUseCase } from "#/modules/insights/features/insights/use-cases/get-leader-tree.usecase.ts";
import { GetLeaderboardUseCase } from "#/modules/insights/features/insights/use-cases/get-leaderboard.usecase.ts";
import { GetLegalBasisUseCase } from "#/modules/insights/features/insights/use-cases/get-legal-basis.usecase.ts";
import { GetMotionUseCase } from "#/modules/insights/features/insights/use-cases/get-motion.usecase.ts";
import { GetNearbyProjectsUseCase } from "#/modules/insights/features/insights/use-cases/get-nearby-projects.usecase.ts";
import { GetPartyUseCase } from "#/modules/insights/features/insights/use-cases/get-party.usecase.ts";
import { GetPlaceCivicUseCase } from "#/modules/insights/features/insights/use-cases/get-place-civic.usecase.ts";
import { GetPlaceCivicAtUseCase } from "#/modules/insights/features/insights/use-cases/get-place-civic-at.usecase.ts";
import { GetPlaceElectionsUseCase } from "#/modules/insights/features/insights/use-cases/get-place-elections.usecase.ts";
import { GetPlaceStatisticsUseCase } from "#/modules/insights/features/insights/use-cases/get-place-statistics.usecase.ts";
import { GetPlaceStatisticsAtUseCase } from "#/modules/insights/features/insights/use-cases/get-place-statistics-at.usecase.ts";
import { GetProjectUseCase } from "#/modules/insights/features/insights/use-cases/get-project.usecase.ts";
import { GlobalSearchUseCase } from "#/modules/insights/features/insights/use-cases/global-search.usecase.ts";
import { ListContentUseCase } from "#/modules/insights/features/insights/use-cases/list-content.usecase.ts";
import { ListElectionsUseCase } from "#/modules/insights/features/insights/use-cases/list-elections.usecase.ts";
import { ListInstitutionsUseCase } from "#/modules/insights/features/insights/use-cases/list-institutions.usecase.ts";
import { ListLawUseCase } from "#/modules/insights/features/insights/use-cases/list-law.usecase.ts";
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
  abstract getCompareOptions(input: CompareOptionsInputDto): Promise<CompareOptionsDto>;
  abstract getComparison(input: ComparisonInputDto): Promise<ComparisonDto>;
  abstract getContent(input: ContentInputDto): Promise<ContentPageDto>;
  abstract getElection(input: ElectionInputDto): Promise<ElectionDetailDto>;
  abstract getGovernanceTabs(): Promise<GovernanceTabsDto>;
  abstract getGovernanceTree(input: GovTreeInputDto): Promise<GovernanceTreeDto>;
  abstract getIndicatorMap(input: MapInputDto): Promise<IndicatorMapDto>;
  abstract getIndicatorSeries(input: SeriesInputDto): Promise<IndicatorSeriesDto>;
  abstract getInstitution(input: CodeInputDto): Promise<InstitutionDetailDto>;
  abstract getLeaderProfile(input: CodeInputDto): Promise<LeaderProfileDto>;
  abstract getLeaderTree(input: TreeInputDto): Promise<LeaderTreeDto>;
  abstract getLeaderboard(input: BoardInputDto): Promise<LeaderboardDto>;
  abstract getLegalBasis(input: LegalBasisInputDto): Promise<LegalBasisDto>;
  abstract getMotion(input: CodeInputDto): Promise<MotionDetailDto>;
  abstract getNearbyProjects(input: NearbyInputDto): Promise<NearbyProjectsDto>;
  abstract getParty(input: CodeInputDto): Promise<PartyDetailDto>;
  abstract getPlaceCivic(input: PlaceOnlyDto): Promise<PlaceCivicDto>;
  abstract getPlaceCivicAt(input: PlaceAtDto): Promise<PlaceCivicDto>;
  abstract getPlaceElections(input: PlaceOnlyDto): Promise<PlaceElectionsDto>;
  abstract getPlaceStatistics(input: PlaceOnlyDto): Promise<PlaceStatisticsDto>;
  abstract getPlaceStatisticsAt(input: PlaceStatisticsInputDto): Promise<PlaceStatisticsDto>;
  abstract getProject(input: CodeInputDto): Promise<ProjectDetailDto>;
  abstract globalSearch(input: SearchQueryDto): Promise<SearchResultsDto>;
  abstract listContent(input: ContentListInputDto): Promise<ContentListDto>;
  abstract listElections(): Promise<ElectionListDto>;
  abstract listInstitutions(input: InstitutionsInputDto): Promise<InstitutionListDto>;
  abstract listLaw(input: LawInputDto): Promise<LawListDto>;
  abstract listLeaderboardMetrics(): Promise<LeaderboardMetricListDto>;
  abstract listMotions(input: MotionsInputDto): Promise<MotionListDto>;
  abstract listParties(): Promise<PartyListDto>;
  abstract listTenders(input: TenderInputDto): Promise<TenderListDto>;
}

@Injectable()
export class InsightsInsightsServiceImpl extends InsightsInsightsService {
  constructor(
    private readonly browsePlacesUseCase: BrowsePlacesUseCase,
    private readonly getCompareOptionsUseCase: GetCompareOptionsUseCase,
    private readonly getComparisonUseCase: GetComparisonUseCase,
    private readonly getContentUseCase: GetContentUseCase,
    private readonly getElectionUseCase: GetElectionUseCase,
    private readonly getGovernanceTabsUseCase: GetGovernanceTabsUseCase,
    private readonly getGovernanceTreeUseCase: GetGovernanceTreeUseCase,
    private readonly getIndicatorMapUseCase: GetIndicatorMapUseCase,
    private readonly getIndicatorSeriesUseCase: GetIndicatorSeriesUseCase,
    private readonly getInstitutionUseCase: GetInstitutionUseCase,
    private readonly getLeaderProfileUseCase: GetLeaderProfileUseCase,
    private readonly getLeaderTreeUseCase: GetLeaderTreeUseCase,
    private readonly getLeaderboardUseCase: GetLeaderboardUseCase,
    private readonly getLegalBasisUseCase: GetLegalBasisUseCase,
    private readonly getMotionUseCase: GetMotionUseCase,
    private readonly getNearbyProjectsUseCase: GetNearbyProjectsUseCase,
    private readonly getPartyUseCase: GetPartyUseCase,
    private readonly getPlaceCivicUseCase: GetPlaceCivicUseCase,
    private readonly getPlaceCivicAtUseCase: GetPlaceCivicAtUseCase,
    private readonly getPlaceElectionsUseCase: GetPlaceElectionsUseCase,
    private readonly getPlaceStatisticsUseCase: GetPlaceStatisticsUseCase,
    private readonly getPlaceStatisticsAtUseCase: GetPlaceStatisticsAtUseCase,
    private readonly getProjectUseCase: GetProjectUseCase,
    private readonly globalSearchUseCase: GlobalSearchUseCase,
    private readonly listContentUseCase: ListContentUseCase,
    private readonly listElectionsUseCase: ListElectionsUseCase,
    private readonly listInstitutionsUseCase: ListInstitutionsUseCase,
    private readonly listLawUseCase: ListLawUseCase,
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

  getCompareOptions(input: CompareOptionsInputDto): Promise<CompareOptionsDto> {
    return this.getCompareOptionsUseCase.execute(input);
  }

  getComparison(input: ComparisonInputDto): Promise<ComparisonDto> {
    return this.getComparisonUseCase.execute(input);
  }

  getContent(input: ContentInputDto): Promise<ContentPageDto> {
    return this.getContentUseCase.execute(input);
  }

  getElection(input: ElectionInputDto): Promise<ElectionDetailDto> {
    return this.getElectionUseCase.execute(input);
  }

  getGovernanceTabs(): Promise<GovernanceTabsDto> {
    return this.getGovernanceTabsUseCase.execute();
  }

  getGovernanceTree(input: GovTreeInputDto): Promise<GovernanceTreeDto> {
    return this.getGovernanceTreeUseCase.execute(input);
  }

  getIndicatorMap(input: MapInputDto): Promise<IndicatorMapDto> {
    return this.getIndicatorMapUseCase.execute(input);
  }

  getIndicatorSeries(input: SeriesInputDto): Promise<IndicatorSeriesDto> {
    return this.getIndicatorSeriesUseCase.execute(input);
  }

  getInstitution(input: CodeInputDto): Promise<InstitutionDetailDto> {
    return this.getInstitutionUseCase.execute(input);
  }

  getLeaderProfile(input: CodeInputDto): Promise<LeaderProfileDto> {
    return this.getLeaderProfileUseCase.execute(input);
  }

  getLeaderTree(input: TreeInputDto): Promise<LeaderTreeDto> {
    return this.getLeaderTreeUseCase.execute(input);
  }

  getLeaderboard(input: BoardInputDto): Promise<LeaderboardDto> {
    return this.getLeaderboardUseCase.execute(input);
  }

  getLegalBasis(input: LegalBasisInputDto): Promise<LegalBasisDto> {
    return this.getLegalBasisUseCase.execute(input);
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

  getPlaceCivicAt(input: PlaceAtDto): Promise<PlaceCivicDto> {
    return this.getPlaceCivicAtUseCase.execute(input);
  }

  getPlaceElections(input: PlaceOnlyDto): Promise<PlaceElectionsDto> {
    return this.getPlaceElectionsUseCase.execute(input);
  }

  getPlaceStatistics(input: PlaceOnlyDto): Promise<PlaceStatisticsDto> {
    return this.getPlaceStatisticsUseCase.execute(input);
  }

  getPlaceStatisticsAt(input: PlaceStatisticsInputDto): Promise<PlaceStatisticsDto> {
    return this.getPlaceStatisticsAtUseCase.execute(input);
  }

  getProject(input: CodeInputDto): Promise<ProjectDetailDto> {
    return this.getProjectUseCase.execute(input);
  }

  globalSearch(input: SearchQueryDto): Promise<SearchResultsDto> {
    return this.globalSearchUseCase.execute(input);
  }

  listContent(input: ContentListInputDto): Promise<ContentListDto> {
    return this.listContentUseCase.execute(input);
  }

  listElections(): Promise<ElectionListDto> {
    return this.listElectionsUseCase.execute();
  }

  listInstitutions(input: InstitutionsInputDto): Promise<InstitutionListDto> {
    return this.listInstitutionsUseCase.execute(input);
  }

  listLaw(input: LawInputDto): Promise<LawListDto> {
    return this.listLawUseCase.execute(input);
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
