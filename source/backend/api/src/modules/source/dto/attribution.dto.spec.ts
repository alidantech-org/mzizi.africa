import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AttributionDto } from "#/modules/source/dto/attribution.dto.ts";
import { attributionExample } from "#/modules/source/dto/attribution.dto.example.ts";

/** Managed by Dryv: AttributionDto enforces exactly what the Attribution contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AttributionDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = attributionExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("AttributionDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(attributionExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...attributionExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});