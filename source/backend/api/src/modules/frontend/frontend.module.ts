import { Module } from "@nestjs/common";
import { FrontendScreensModule } from "#/modules/frontend/features/screens/screens.module.ts";

@Module({
  imports: [FrontendScreensModule],
})
export class FrontendModule {}
