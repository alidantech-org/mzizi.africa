import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { TalliesDto } from "#/modules/election/schema/dto/tallies.dto.ts";
import { talliesExample } from "@test/modules/election/schema/dto/examples/tallies.dto.example.ts";

/** Managed by Dryv: TalliesDto enforces exactly what the Tallies contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(TalliesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = talliesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("TalliesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(talliesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...talliesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
