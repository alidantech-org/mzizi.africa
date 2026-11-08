import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EventListQueryDto } from "#/modules/events/dto/event-list-query.dto.ts";
import { eventListQueryExample } from "#/modules/events/dto/event-list-query.dto.example.ts";

/** Managed by Dryv: EventListQueryDto enforces exactly what the EventListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EventListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = eventListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("EventListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(eventListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...eventListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});