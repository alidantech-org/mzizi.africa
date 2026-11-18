import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CalendarEventDto } from "#/modules/experience/schema/dto/calendar-event.dto.ts";
import { calendarEventExample } from "@test/modules/experience/schema/dto/examples/calendar-event.dto.example.ts";

/** Managed by Dryv: CalendarEventDto enforces exactly what the CalendarEvent contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CalendarEventDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = calendarEventExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CalendarEventDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(calendarEventExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...calendarEventExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
