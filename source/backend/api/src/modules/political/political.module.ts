import { Module } from "@nestjs/common";
import { PoliticalPoliticalReadModule } from "#/modules/political/political-read/political-read.module.ts";

@Module({
  imports: [
    PoliticalPoliticalReadModule,
  ],
})
export class PoliticalModule {}