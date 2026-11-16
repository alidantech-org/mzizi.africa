import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { HistoricalValidityEntityDto } from "#/modules/shared/schema/dto/historical-validity-entity.dto.ts";
import { historicalValidityEntityExample } from "@test/modules/shared/schema/dto/examples/historical-validity-entity.dto.example.ts";

/** Managed by Dryv: HistoricalValidityEntityDto enforces exactly what the HistoricalValidityEntity contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(HistoricalValidityEntityDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = historicalValidityEntityExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("HistoricalValidityEntityDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(historicalValidityEntityExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(
      await errorsFor({
        ...historicalValidityEntityExample.valid(),
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
