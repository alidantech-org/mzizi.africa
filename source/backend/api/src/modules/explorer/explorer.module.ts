import { Module } from "@nestjs/common";
import { ExplorerExplorerModule } from "#/modules/explorer/features/explorer/explorer.module.ts";

@Module({
  imports: [ExplorerExplorerModule],
})
export class ExplorerModule {}
