import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ChangesDto } from "#/modules/geography/schema/dto/changes.dto.ts";
import { changesExample } from "#/modules/geography/schema/dto/examples/changes.dto.example.ts";

/** Managed by Dryv: ChangesDto enforces exactly what the Changes contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ChangesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = changesExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ChangesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(changesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...changesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});