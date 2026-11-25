import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SubscriptionsDto } from "#/modules/community/schema/dto/subscriptions.dto.ts";
import { subscriptionsExample } from "@test/modules/community/schema/dto/examples/subscriptions.dto.example.ts";

/** Managed by Dryv: SubscriptionsDto enforces exactly what the Subscriptions contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SubscriptionsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = subscriptionsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("SubscriptionsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(subscriptionsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...subscriptionsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
