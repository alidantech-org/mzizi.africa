import "reflect-metadata";

import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";

import { DossierDto } from "#/modules/website/dto/dossier.dto.ts";
import { dossierExample } from "#/modules/website/dto/dossier.dto.example.ts";

/** Managed by Dryv: DossierDto enforces exactly what the Dossier contract says. */
async function errorsFor(value: Record<string, unknown>): Promise<string[]> {
  const errors = await validate(plainToInstance(DossierDto, value), {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: false,
  });
  return errors.map((error) => error.property);
}

const cases = dossierExample.violations().map((item) => [item.field, item.reason, item.value] as const);

describe("DossierDto contract", () => {
  it("accepts the contract example", async () => {
    expect(await errorsFor(dossierExample.valid())).toEqual([]);
  });

  it("rejects unknown properties", async () => {
    expect(await errorsFor({ ...dossierExample.valid(), unexpectedField: 1 })).toContain(
      "unexpectedField",
    );
  });

  if (cases.length > 0) {
    it.each(cases)("rejects %s when %s", async (field, _reason, value) => {
      expect(await errorsFor(value)).toContain(field);
    });
  }
});