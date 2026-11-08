import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { EventLinkListQueryDto } from "#/modules/events/dto/event-link-list-query.dto.ts";
import { eventLinkListQueryExample } from "#/modules/events/dto/event-link-list-query.dto.example.ts";

/** Managed by Dryv: EventLinkListQueryDto enforces exactly what the EventLinkListQuery contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(EventLinkListQueryDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = eventLinkListQueryExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("EventLinkListQueryDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(eventLinkListQueryExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...eventLinkListQueryExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});