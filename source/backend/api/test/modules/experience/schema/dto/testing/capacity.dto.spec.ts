import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { CapacityDto } from "#/modules/experience/schema/dto/capacity.dto.ts";
import { capacityExample } from "@test/modules/experience/schema/dto/examples/capacity.dto.example.ts";

/** Managed by Dryv: CapacityDto enforces exactly what the Capacity contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(CapacityDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = capacityExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("CapacityDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(capacityExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...capacityExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
