import { Injectable, } from "@nestjs/common";
import { DataSource } from "typeorm";
import { calendar } from "#/modules/experience/features/experience/reads/calendar.ts";
import type { CalendarInputDto } from "#/modules/experience/schema/dto/calendar-input.dto";
import type { CalendarDto } from "#/modules/experience/schema/dto/calendar.dto";

/**
 * Dated events for a range, with whether each date moved and how it is known, and the countdown to the next general election with its timetable milestones.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Write the use case here.
 */
@Injectable()
export class GetCalendarUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: CalendarInputDto): Promise<CalendarDto> {
    return (await calendar(this.db, input)) as unknown as CalendarDto;
  }
}
