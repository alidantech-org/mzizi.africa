import { Module } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";

import { DatabaseModule } from "./database/database.module.ts";
import { AuditModule } from "#/modules/audit/audit.module.ts";
import { DebtModule } from "#/modules/debt/debt.module.ts";
import { ElectionsModule } from "#/modules/elections/elections.module.ts";
import { EntitiesModule } from "#/modules/entities/entities.module.ts";
import { EventsModule } from "#/modules/events/events.module.ts";
import { FilesystemModule } from "#/modules/filesystem/filesystem.module.ts";
import { FinanceModule } from "#/modules/finance/finance.module.ts";
import { GeographyModule } from "#/modules/geography/geography.module.ts";
import { GovernanceModule } from "#/modules/governance/governance.module.ts";
import { LegalModule } from "#/modules/legal/legal.module.ts";
import { PersonModule } from "#/modules/person/person.module.ts";
import { PoliticalModule } from "#/modules/political/political.module.ts";
import { ProcurementModule } from "#/modules/procurement/procurement.module.ts";
import { ReferenceModule } from "#/modules/reference/reference.module.ts";
import { ServicesModule } from "#/modules/services/services.module.ts";
import { SourceModule } from "#/modules/source/source.module.ts";
import { StatisticsModule } from "#/modules/statistics/statistics.module.ts";
import { HttpValidationPipe, httpOptions } from "#/server/http.options.ts";

@Module({
  imports: [
    DatabaseModule,
    AuditModule,
    DebtModule,
    ElectionsModule,
    EntitiesModule,
    EventsModule,
    FilesystemModule,
    FinanceModule,
    GeographyModule,
    GovernanceModule,
    LegalModule,
    PersonModule,
    PoliticalModule,
    ProcurementModule,
    ReferenceModule,
    ServicesModule,
    SourceModule,
    StatisticsModule,
  ],
  providers: [
    { provide: APP_PIPE, useValue: new HttpValidationPipe(httpOptions) },
  ],
})
export class AppModule {}