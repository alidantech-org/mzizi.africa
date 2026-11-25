import { Module } from "@nestjs/common";
import { PoliticsPartiesModule } from "#/modules/politics/features/parties/parties.module.ts";
import { PoliticsPromisesModule } from "#/modules/politics/features/promises/promises.module.ts";

@Module({
  imports: [PoliticsPartiesModule, PoliticsPromisesModule],
})
export class PoliticsModule {}
