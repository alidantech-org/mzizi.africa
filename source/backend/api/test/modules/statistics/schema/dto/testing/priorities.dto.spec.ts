import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PrioritiesDto } from "#/modules/statistics/schema/dto/priorities.dto.ts";
import { prioritiesExample } from "@test/modules/statistics/schema/dto/examples/priorities.dto.example.ts";

/** Managed by Dryv: PrioritiesDto enforces exactly what the Priorities contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PrioritiesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = prioritiesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PrioritiesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(prioritiesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...prioritiesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
