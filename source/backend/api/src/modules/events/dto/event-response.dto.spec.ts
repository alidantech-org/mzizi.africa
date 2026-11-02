import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EventResponseDto } from "#/modules/events/dto/event-response.dto.ts";
import { eventResponseExample } from "#/modules/events/dto/event-response.dto.example.ts";

/** Managed by Dryv: EventResponseDto enforces exactly what the EventResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EventResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = eventResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("EventResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(eventResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...eventResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});