import { Module } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { AuthModule } from "#/modules/auth/auth.module.ts";
import { CivicModule } from "#/modules/civic/civic.module.ts";
import { CommunityModule } from "#/modules/community/community.module.ts";
import { ElectionModule } from "#/modules/election/election.module.ts";
import { EventModule } from "#/modules/event/event.module.ts";
import { FinanceModule } from "#/modules/finance/finance.module.ts";
import { FrontendModule } from "#/modules/frontend/frontend.module.ts";
import { GeographyModule } from "#/modules/geography/geography.module.ts";
import { GovernanceModule } from "#/modules/governance/governance.module.ts";
import { HistoryModule } from "#/modules/history/history.module.ts";
import { IdentityModule } from "#/modules/identity/identity.module.ts";
import { LegalModule } from "#/modules/legal/legal.module.ts";
import { LegislatureModule } from "#/modules/legislature/legislature.module.ts";
import { MediaModule } from "#/modules/media/media.module.ts";
import { PoliticsModule } from "#/modules/politics/politics.module.ts";
import { ProductModule } from "#/modules/product/product.module.ts";
import { ReferenceModule } from "#/modules/reference/reference.module.ts";
import { SourceModule } from "#/modules/source/source.module.ts";
import { StatisticsModule } from "#/modules/statistics/statistics.module.ts";
import { VocabularyModule } from "#/modules/vocabulary/vocabulary.module.ts";
import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";

@Module({
  imports: [
    AuthModule,
    CivicModule,
    CommunityModule,
    ElectionModule,
    EventModule,
    FinanceModule,
    FrontendModule,
    GeographyModule,
    GovernanceModule,
    HistoryModule,
    IdentityModule,
    LegalModule,
    LegislatureModule,
    MediaModule,
    PoliticsModule,
    ProductModule,
    ReferenceModule,
    SourceModule,
    StatisticsModule,
    VocabularyModule,
  ],
  providers: [{ provide: APP_PIPE, useValue: new HttpValidationPipe(httpOptions) }],
})
export class AppModule {}
