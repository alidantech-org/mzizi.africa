import { Module, type Type } from "@nestjs/common";
import { InsightsInsightsRepository } from "#/modules/insights/features/insights/repositories/insights.repository.ts";
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
import { GetPlaceElectionsUseCase } from "#/modules/insights/features/insights/use-cases/get-place-elections.usecase.ts";
import { GetPlaceStatisticsUseCase } from "#/modules/insights/features/insights/use-cases/get-place-statistics.usecase.ts";
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

import { InsightsInsightsController } from "./insights.controller.ts";
import { InsightsInsightsService, InsightsInsightsServiceImpl } from "./insights.service.ts";

@Module({
  controllers: [InsightsInsightsController],
  providers: [
    {
      provide: InsightsInsightsService,
      useClass: InsightsInsightsServiceImpl satisfies Type<InsightsInsightsService>,
    },
    BrowsePlacesUseCase,
    GetCompareOptionsUseCase,
    GetComparisonUseCase,
    GetContentUseCase,
    GetElectionUseCase,
    GetGovernanceTabsUseCase,
    GetGovernanceTreeUseCase,
    GetIndicatorMapUseCase,
    GetIndicatorSeriesUseCase,
    GetInstitutionUseCase,
    GetLeaderProfileUseCase,
    GetLeaderTreeUseCase,
    GetLeaderboardUseCase,
    GetLegalBasisUseCase,
    GetMotionUseCase,
    GetNearbyProjectsUseCase,
    GetPartyUseCase,
    GetPlaceCivicUseCase,
    GetPlaceElectionsUseCase,
    GetPlaceStatisticsUseCase,
    GetProjectUseCase,
    GlobalSearchUseCase,
    ListContentUseCase,
    ListElectionsUseCase,
    ListInstitutionsUseCase,
    ListLawUseCase,
    ListLeaderboardMetricsUseCase,
    ListMotionsUseCase,
    ListPartiesUseCase,
    ListTendersUseCase,
    InsightsInsightsRepository,
  ],
  exports: [InsightsInsightsService],
})
export class InsightsInsightsModule {}
