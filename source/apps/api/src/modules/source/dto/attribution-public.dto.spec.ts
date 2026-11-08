import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { AttributionPublicDto } from "#/modules/source/dto/attribution-public.dto.ts";
import { attributionPublicExample } from "#/modules/source/dto/attribution-public.dto.example.ts";

/** Managed by Dryv: AttributionPublicDto enforces exactly what the AttributionPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(AttributionPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = attributionPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("AttributionPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(attributionPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...attributionPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});