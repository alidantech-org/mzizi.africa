import { Module } from "@nestjs/common";
import { CivicBuyingModule } from "#/modules/civic/features/buying/buying.module.ts";
import { CivicDeliveryModule } from "#/modules/civic/features/delivery/delivery.module.ts";

@Module({
  imports: [CivicBuyingModule, CivicDeliveryModule],
})
export class CivicModule {}
