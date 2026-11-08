import { Module } from "@nestjs/common";
import { EventsEventsReadModule } from "#/modules/events/events-read/events-read.module.ts";

@Module({
  imports: [
    EventsEventsReadModule,
  ],
})
export class EventsModule {}