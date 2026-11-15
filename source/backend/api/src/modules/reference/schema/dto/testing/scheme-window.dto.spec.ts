import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { SchemeWindowDto } from "#/modules/reference/schema/dto/scheme-window.dto.ts";
import { schemeWindowExample } from "#/modules/reference/schema/dto/examples/scheme-window.dto.example.ts";

/** Managed by Dryv: SchemeWindowDto enforces exactly what the SchemeWindow contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(SchemeWindowDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = schemeWindowExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("SchemeWindowDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(schemeWindowExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...schemeWindowExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});