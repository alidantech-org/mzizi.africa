import { Controller, Get, HttpCode, Param, ParseIntPipe, Query } from "@nestjs/common";
import { BrowseInputDto } from "#/modules/insights/schema/dto/browse-input.dto.ts";
import { ElectionDetailDto } from "#/modules/insights/schema/dto/election-detail.dto.ts";
import { ElectionListDto } from "#/modules/insights/schema/dto/election-list.dto.ts";
import { IndicatorMapDto } from "#/modules/insights/schema/dto/indicator-map.dto.ts";
import { IndicatorSeriesDto } from "#/modules/insights/schema/dto/indicator-series.dto.ts";
import { LeaderProfileDto } from "#/modules/insights/schema/dto/leader-profile.dto.ts";
import { LeaderboardMetricListDto } from "#/modules/insights/schema/dto/leaderboard-metric-list.dto.ts";
import { LeaderboardDto } from "#/modules/insights/schema/dto/leaderboard.dto.ts";
import { MotionDetailDto } from "#/modules/insights/schema/dto/motion-detail.dto.ts";
import { MotionListDto } from "#/modules/insights/schema/dto/motion-list.dto.ts";
import { MotionsInputDto } from "#/modules/insights/schema/dto/motions-input.dto.ts";
import { NearbyInputDto } from "#/modules/insights/schema/dto/nearby-input.dto.ts";
import { NearbyProjectsDto } from "#/modules/insights/schema/dto/nearby-projects.dto.ts";
import { PartyDetailDto } from "#/modules/insights/schema/dto/party-detail.dto.ts";
import { PartyListDto } from "#/modules/insights/schema/dto/party-list.dto.ts";
import { PlaceBrowseDto } from "#/modules/insights/schema/dto/place-browse.dto.ts";
import { PlaceCivicDto } from "#/modules/insights/schema/dto/place-civic.dto.ts";
import { PlaceElectionsDto } from "#/modules/insights/schema/dto/place-elections.dto.ts";
import { PlaceStatisticsDto } from "#/modules/insights/schema/dto/place-statistics.dto.ts";
import { ProjectDetailDto } from "#/modules/insights/schema/dto/project-detail.dto.ts";
import { SearchQueryDto } from "#/modules/insights/schema/dto/search-query.dto.ts";
import { SearchResultsDto } from "#/modules/insights/schema/dto/search-results.dto.ts";
import { TenderInputDto } from "#/modules/insights/schema/dto/tender-input.dto.ts";
import { TenderListDto } from "#/modules/insights/schema/dto/tender-list.dto.ts";
import { InsightsInsightsService } from "./insights.service.ts";

@Controller()
export class InsightsInsightsController {
  constructor(private readonly service: InsightsInsightsService) {}

  @Get("/v1/browse")
  @HttpCode(200)
  browsePlaces(@Query() input: BrowseInputDto): Promise<PlaceBrowseDto> {
    return this.service.browsePlaces(input);
  }

  @Get("/v1/projects/near")
  @HttpCode(200)
  getNearbyProjects(@Query() input: NearbyInputDto): Promise<NearbyProjectsDto> {
    return this.service.getNearbyProjects(input);
  }

  @Get("/v1/search")
  @HttpCode(200)
  globalSearch(@Query() input: SearchQueryDto): Promise<SearchResultsDto> {
    return this.service.globalSearch(input);
  }

  @Get("/v1/elections")
  @HttpCode(200)
  listElections(): Promise<ElectionListDto> {
    return this.service.listElections();
  }

  @Get("/v1/leaderboards")
  @HttpCode(200)
  listLeaderboardMetrics(): Promise<LeaderboardMetricListDto> {
    return this.service.listLeaderboardMetrics();
  }

  @Get("/v1/motions")
  @HttpCode(200)
  listMotions(@Query() input: MotionsInputDto): Promise<MotionListDto> {
    return this.service.listMotions(input);
  }

  @Get("/v1/parties")
  @HttpCode(200)
  listParties(): Promise<PartyListDto> {
    return this.service.listParties();
  }

  @Get("/v1/tenders")
  @HttpCode(200)
  listTenders(@Query() input: TenderInputDto): Promise<TenderListDto> {
    return this.service.listTenders(input);
  }

  @Get("/v1/elections/:electionId")
  @HttpCode(200)
  getElection(
    @Param("electionId") electionId: string,
    @Query("parentFeatureId") parentFeatureId: string,
    @Query("contestKind") contestKind: string,
  ): Promise<ElectionDetailDto> {
    return this.service.getElection({
      electionId,
      parentFeatureId,
      contestKind,
    });
  }

  @Get("/v1/statistics/indicators/:indicatorCode/map")
  @HttpCode(200)
  getIndicatorMap(
    @Param("indicatorCode") indicatorCode: string,
    @Query("parentFeatureId") parentFeatureId: string,
    @Query("kindCode") kindCode: string,
  ): Promise<IndicatorMapDto> {
    return this.service.getIndicatorMap({
      indicatorCode,
      parentFeatureId,
      kindCode,
    });
  }

  @Get("/v1/statistics/indicators/:indicatorCode/series")
  @HttpCode(200)
  getIndicatorSeries(
    @Param("indicatorCode") indicatorCode: string,
    @Query("featureId") featureId: string,
  ): Promise<IndicatorSeriesDto> {
    return this.service.getIndicatorSeries({ indicatorCode, featureId });
  }

  @Get("/v1/leaders/:id")
  @HttpCode(200)
  getLeaderProfile(@Param("id") id: string): Promise<LeaderProfileDto> {
    return this.service.getLeaderProfile({ id });
  }

  @Get("/v1/leaderboards/:metricCode")
  @HttpCode(200)
  getLeaderboard(
    @Param("metricCode") metricCode: string,
    @Query("kindCode") kindCode: string,
    @Query("parentFeatureId") parentFeatureId: string,
    @Query("limit", ParseIntPipe) limit: number,
  ): Promise<LeaderboardDto> {
    return this.service.getLeaderboard({
      metricCode,
      kindCode,
      parentFeatureId,
      limit,
    });
  }

  @Get("/v1/motions/:code")
  @HttpCode(200)
  getMotion(@Param("code") code: string): Promise<MotionDetailDto> {
    return this.service.getMotion({ code });
  }

  @Get("/v1/parties/:code")
  @HttpCode(200)
  getParty(@Param("code") code: string): Promise<PartyDetailDto> {
    return this.service.getParty({ code });
  }

  @Get("/v1/civic/places/:featureId")
  @HttpCode(200)
  getPlaceCivic(@Param("featureId") featureId: string): Promise<PlaceCivicDto> {
    return this.service.getPlaceCivic({ featureId });
  }

  @Get("/v1/elections/places/:featureId")
  @HttpCode(200)
  getPlaceElections(@Param("featureId") featureId: string): Promise<PlaceElectionsDto> {
    return this.service.getPlaceElections({ featureId });
  }

  @Get("/v1/statistics/places/:featureId")
  @HttpCode(200)
  getPlaceStatistics(@Param("featureId") featureId: string): Promise<PlaceStatisticsDto> {
    return this.service.getPlaceStatistics({ featureId });
  }

  @Get("/v1/projects/:code")
  @HttpCode(200)
  getProject(@Param("code") code: string): Promise<ProjectDetailDto> {
    return this.service.getProject({ code });
  }
}
