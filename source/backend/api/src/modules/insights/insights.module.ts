import { Module } from "@nestjs/common";
import { InsightsInsightsModule } from "#/modules/insights/features/insights/insights.module.ts";

@Module({
  imports: [InsightsInsightsModule],
})
export class InsightsModule {}
