import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EventsDto } from "#/modules/event/schema/dto/events.dto.ts";
import { eventsExample } from "@test/modules/event/schema/dto/examples/events.dto.example.ts";

/** Managed by Dryv: EventsDto enforces exactly what the Events contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EventsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = eventsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("EventsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(eventsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...eventsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
