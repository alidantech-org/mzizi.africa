import { Module } from "@nestjs/common";
import { IdentityThingsModule } from "#/modules/identity/features/things/things.module.ts";

@Module({
  imports: [IdentityThingsModule],
})
export class IdentityModule {}
