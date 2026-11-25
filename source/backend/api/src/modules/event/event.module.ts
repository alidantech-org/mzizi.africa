import { Module } from "@nestjs/common";
import { EventCalendarModule } from "#/modules/event/features/calendar/calendar.module.ts";

@Module({
  imports: [EventCalendarModule],
})
export class EventModule {}
