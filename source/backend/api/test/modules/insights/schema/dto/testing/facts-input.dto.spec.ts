import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { FactsInputDto } from "#/modules/insights/schema/dto/facts-input.dto.ts";
import { factsInputExample } from "@test/modules/insights/schema/dto/examples/facts-input.dto.example.ts";

/** Managed by Dryv: FactsInputDto enforces exactly what the FactsInput contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(FactsInputDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = factsInputExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("FactsInputDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(factsInputExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...factsInputExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
