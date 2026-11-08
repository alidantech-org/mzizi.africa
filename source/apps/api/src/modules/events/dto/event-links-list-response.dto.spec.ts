import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EventLinksListResponseDto } from "#/modules/events/dto/event-links-list-response.dto.ts";
import { eventLinksListResponseExample } from "#/modules/events/dto/event-links-list-response.dto.example.ts";

/** Managed by Dryv: EventLinksListResponseDto enforces exactly what the EventLinksListResponse contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EventLinksListResponseDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = eventLinksListResponseExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("EventLinksListResponseDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(eventLinksListResponseExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...eventLinksListResponseExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});