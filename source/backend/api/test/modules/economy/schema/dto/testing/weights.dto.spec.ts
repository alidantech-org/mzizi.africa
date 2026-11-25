import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { WeightsDto } from "#/modules/economy/schema/dto/weights.dto.ts";
import { weightsExample } from "@test/modules/economy/schema/dto/examples/weights.dto.example.ts";

/** Managed by Dryv: WeightsDto enforces exactly what the Weights contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(WeightsDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = weightsExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("WeightsDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(weightsExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...weightsExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
