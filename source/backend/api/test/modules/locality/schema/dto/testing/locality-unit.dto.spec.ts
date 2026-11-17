import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { LocalityUnitDto } from "#/modules/locality/schema/dto/locality-unit.dto.ts";
import { localityUnitExample } from "@test/modules/locality/schema/dto/examples/locality-unit.dto.example.ts";

/** Managed by Dryv: LocalityUnitDto enforces exactly what the LocalityUnit contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(LocalityUnitDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = localityUnitExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("LocalityUnitDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(localityUnitExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...localityUnitExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
