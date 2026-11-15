import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { NamesDto } from "#/modules/geography/schema/dto/names.dto.ts";
import { namesExample } from "#/modules/geography/schema/dto/examples/names.dto.example.ts";

/** Managed by Dryv: NamesDto enforces exactly what the Names contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(NamesDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = namesExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("NamesDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(namesExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...namesExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});