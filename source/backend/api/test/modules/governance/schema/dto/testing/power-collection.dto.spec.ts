import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PowerCollectionDto } from "#/modules/governance/schema/dto/power-collection.dto.ts";
import { powerCollectionExample } from "@test/modules/governance/schema/dto/examples/power-collection.dto.example.ts";

/** Managed by Dryv: PowerCollectionDto enforces exactly what the PowerCollection contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PowerCollectionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = powerCollectionExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PowerCollectionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(powerCollectionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...powerCollectionExample.valid(),
        unexpectedField: 1,
      }),
    ).toContain("unexpectedField");
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
