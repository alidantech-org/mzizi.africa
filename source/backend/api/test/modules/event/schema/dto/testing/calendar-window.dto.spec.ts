import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CalendarWindowDto } from "#/modules/event/schema/dto/calendar-window.dto.ts";
import { calendarWindowExample } from "@test/modules/event/schema/dto/examples/calendar-window.dto.example.ts";

/** Managed by Dryv: CalendarWindowDto enforces exactly what the CalendarWindow contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CalendarWindowDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = calendarWindowExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CalendarWindowDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(calendarWindowExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...calendarWindowExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
