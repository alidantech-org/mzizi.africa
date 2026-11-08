import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ManifestoPublicDto } from "#/modules/elections/dto/manifesto-public.dto.ts";
import { manifestoPublicExample } from "#/modules/elections/dto/manifesto-public.dto.example.ts";

/** Managed by Dryv: ManifestoPublicDto enforces exactly what the ManifestoPublic contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ManifestoPublicDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = manifestoPublicExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("ManifestoPublicDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(manifestoPublicExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...manifestoPublicExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});