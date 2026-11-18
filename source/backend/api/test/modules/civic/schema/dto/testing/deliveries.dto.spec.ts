import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { DeliveriesDto } from "#/modules/civic/schema/dto/deliveries.dto.ts";
import { deliveriesExample } from "@test/modules/civic/schema/dto/examples/deliveries.dto.example.ts";

/** Managed by Dryv: DeliveriesDto enforces exactly what the Deliveries contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(DeliveriesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = deliveriesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("DeliveriesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(deliveriesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...deliveriesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
