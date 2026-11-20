import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { OverviewDto } from "#/modules/explorer/schema/dto/overview.dto.ts";
import { overviewExample } from "@test/modules/explorer/schema/dto/examples/overview.dto.example.ts";

/** Managed by Dryv: OverviewDto enforces exactly what the Overview contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(OverviewDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = overviewExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("OverviewDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(overviewExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...overviewExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
