import { Module } from "@nestjs/common";
import { LocalityPlacesModule } from "#/modules/locality/features/places/places.module.ts";

@Module({
  imports: [LocalityPlacesModule],
})
export class LocalityModule {}
