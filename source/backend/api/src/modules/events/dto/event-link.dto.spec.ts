import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EventLinkDto } from "#/modules/events/dto/event-link.dto.ts";
import { eventLinkExample } from "#/modules/events/dto/event-link.dto.example.ts";

/** Managed by Dryv: EventLinkDto enforces exactly what the EventLink contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EventLinkDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = eventLinkExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("EventLinkDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(eventLinkExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...eventLinkExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});