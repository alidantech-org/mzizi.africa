import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EventLinkResponseDto } from "#/modules/events/dto/event-link-response.dto.ts";
import { eventLinkResponseExample } from "#/modules/events/dto/event-link-response.dto.example.ts";

/** Managed by Dryv: EventLinkResponseDto enforces exactly what the EventLinkResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EventLinkResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = eventLinkResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("EventLinkResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(eventLinkResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...eventLinkResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});