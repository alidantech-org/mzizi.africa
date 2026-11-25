import { Module, type Type } from "@nestjs/common";
import { ListOccurrencesUseCase } from "#/modules/event/features/calendar/use-cases/list-occurrences.repository.ts";

import { EventCalendarController } from "./calendar.controller.ts";
import { EventCalendarService, EventCalendarServiceImpl } from "./calendar.service.ts";

@Module({
  controllers: [EventCalendarController],
  providers: [
    {
      provide: EventCalendarService,
      useClass: EventCalendarServiceImpl satisfies Type<EventCalendarService>,
    },
    ListOccurrencesUseCase,
  ],
  exports: [EventCalendarService],
})
export class EventCalendarModule {}
