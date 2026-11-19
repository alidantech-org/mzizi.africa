import { Module } from "@nestjs/common";
import { InteractionsInteractionsModule } from "#/modules/interactions/features/interactions/interactions.module.ts";

@Module({
  imports: [InteractionsInteractionsModule],
})
export class InteractionsModule {}
