import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CalendarsDto } from "#/modules/event/schema/dto/calendars.dto.ts";
import { calendarsExample } from "@test/modules/event/schema/dto/examples/calendars.dto.example.ts";

/** Managed by Dryv: CalendarsDto enforces exactly what the Calendars contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CalendarsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = calendarsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CalendarsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(calendarsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...calendarsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
