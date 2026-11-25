import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SchemesDto } from "#/modules/vocabulary/schema/dto/schemes.dto.ts";
import { schemesExample } from "@test/modules/vocabulary/schema/dto/examples/schemes.dto.example.ts";

/** Managed by Dryv: SchemesDto enforces exactly what the Schemes contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SchemesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = schemesExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("SchemesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(schemesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...schemesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
