import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { ManifestosDto } from "#/modules/politics/schema/dto/manifestos.dto.ts";
import { manifestosExample } from "@test/modules/politics/schema/dto/examples/manifestos.dto.example.ts";

/** Managed by Dryv: ManifestosDto enforces exactly what the Manifestos contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(ManifestosDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = manifestosExample
  .violations()
  .map((item) => [item.field, item.reason, item.value] as const);

describe("ManifestosDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(manifestosExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...manifestosExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});
