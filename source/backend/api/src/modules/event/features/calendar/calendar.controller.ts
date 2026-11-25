import { Controller, Get, HttpCode, Query } from "@nestjs/common";
import { CalendarWindowDto } from "#/modules/event/schema/dto/calendar-window.dto.ts";
import { OccurrenceCollectionDto } from "#/modules/event/schema/dto/occurrence-collection.dto.ts";
import { EventCalendarService } from "./calendar.service.ts";

@Controller()
export class EventCalendarController {
  constructor(private readonly service: EventCalendarService) {}

  @Get("/v1/event/occurrences")
  @HttpCode(200)
  listOccurrences(@Query() input: CalendarWindowDto): Promise<OccurrenceCollectionDto> {
    return this.service.listOccurrences(input);
  }
}
