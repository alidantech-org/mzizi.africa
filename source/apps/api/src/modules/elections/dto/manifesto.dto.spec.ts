import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ManifestoDto } from "#/modules/elections/dto/manifesto.dto.ts";
import { manifestoExample } from "#/modules/elections/dto/manifesto.dto.example.ts";

/** Managed by Dryv: ManifestoDto enforces exactly what the Manifesto contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ManifestoDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = manifestoExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ManifestoDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(manifestoExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...manifestoExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});