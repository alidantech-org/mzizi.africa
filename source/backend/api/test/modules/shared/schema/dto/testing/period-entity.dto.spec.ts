import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { PeriodEntityDto } from "#/modules/shared/schema/dto/period-entity.dto.ts";
import { periodEntityExample } from "@test/modules/shared/schema/dto/examples/period-entity.dto.example.ts";

/** Managed by Dryv: PeriodEntityDto enforces exactly what the PeriodEntity contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(PeriodEntityDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = periodEntityExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("PeriodEntityDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(periodEntityExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...periodEntityExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
